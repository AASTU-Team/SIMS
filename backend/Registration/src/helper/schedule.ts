import _ from 'lodash';
import { Department, Class, Room, Course, Instructor, MeetingTime, IClass } from './models'; // Adjust the path as necessary
import { Schema, model, Document, Types } from 'mongoose';
const POPULATION_SIZE = 9;
const NUMB_OF_ELITE_SCHEDULES = 1;
const TOURNAMENT_SELECTION_SIZE = 3;
const MUTATION_RATE = 0.1;
interface IInstructor extends Document {
    id: string;
    name: string;
  }
  
  interface ICourse extends Document {
    number: string;
    name: string;
    instructors: Types.ObjectId[];
    maxNumberOfStudents: number;
  }
  
  interface IDepartment extends Document {
    name: string;
    courses: Types.ObjectId[];
  }
  
  interface IRoom extends Document {
    number: string;
    seatingCapacity: number;
  }
  
  interface IMeetingTime extends Document {
    id: string;
    time: string;
  }
  
  interface IClass extends Document {
    id: number;
    dept: Types.ObjectId;
    course: Types.ObjectId;
    instructor: Types.ObjectId;
    meetingTime: Types.ObjectId;
    room: Types.ObjectId;
  }
  

interface IData {
  meetingTimes: IMeetingTime[];
  rooms: IRoom[];
}

class Schedule {
  private _data: IData;
  private _classes: IClass[] = [];
  private _numOfConflicts: number = 0;
  private _fitness: number = -1;
  private _classNumb: number = 0;
  private _isFitnessChanged: boolean = true;

  constructor(data: IData) {
    this._data = data;
  }

  async initialize(): Promise<Schedule> {
    const depts = await Department.find().populate('courses').exec();
    for (const dept of depts) {
      for (const course of dept.courses) {
        const newClass = new Class({
          id: this._classNumb++,
          dept: dept._id,
          course: course._id,
          meetingTime: _.sample(this._data.meetingTimes)._id,
          room: _.sample(this._data.rooms)._id,
          instructor: _.sample(course.instructors)._id
        });
        this._classes.push(newClass);
        await newClass.save();
      }
    }
    return this;
  }

  async calculateFitness(): Promise<number> {
    this._numOfConflicts = 0;
    const classes = await Class.find().populate(['dept', 'course', 'instructor', 'meetingTime', 'room']).exec

  }
}