import { Request, Response } from 'express';
import ApprovalProcess from '../../models/approvalProcess.model';
import Grade from '../../models/grade.model';
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

class ApprovalController {
    //TODO: Notify
  static async notifyInstructor(instructorId: mongoose.Types.ObjectId, message: string) {
    console.log(`Notify instructor ${instructorId}: ${message}`);
  }

  static async submitForApproval(req: Request, res: Response) {
    const { gradeId, requestedBy } = req.body;

    try {
      // Check if the grade exists
      const grade = await Grade.findById(gradeId);
      if (!grade) {
        return res.status(404).json({ error: 'Grade not found' });
      }

      const attendanceApiUrl = `${process.env.ATTENDANCE_SERVICE_URL}/attendance/student`;
      const attendanceResponse = await axios.post(attendanceApiUrl, {
        course_id: grade.course_id.toString(),
        student_id: grade.student_id.toString()
      });

      const attendanceRecords = attendanceResponse.data;
      if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(404).json({ error: 'Attendance records not found' });
      }

      // Calculate attendance percentage
      const totalClasses = attendanceRecords[0].attendances.length;
      const presentClasses = attendanceRecords[0].attendances.filter((att: any) => att.status === 'Present').length;
      const attendancePercentage = (presentClasses / totalClasses) * 100;

      // Create an approval process document
      const approvalProcess = new ApprovalProcess({
        grade_id: new mongoose.Types.ObjectId(gradeId),
        status: 'Pending',
        department_approval: {
          status: 'Pending',
          by: null,
          reason: '',
        },
        dean_approval: {
          status: 'Pending',
          by: null,
          reason: '',
        },
        requested_by: new mongoose.Types.ObjectId(requestedBy),
        requested_at: new Date(),
        attendance_percentage: attendancePercentage
      });

      await approvalProcess.save();
      return res.status(201).json({ message: 'Grade submitted for approval', approvalProcess });

    } catch (error) {
      console.error('Error submitting grade for approval:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async departmentApproval(req: Request, res: Response) {
    const { approvalId } = req.params;
    const { status, by, reason } = req.body;

    try {
      // Find the approval process document
      const approvalProcess = await ApprovalProcess.findById(approvalId);
      if (!approvalProcess) {
        return res.status(404).json({ error: 'Approval process not found' });
      }

      // Update department approval
      approvalProcess.department_approval.status = status;
      approvalProcess.department_approval.by = new mongoose.Types.ObjectId(by);
      if (status === 'Rejected') {
        if (!reason) {
          return res.status(400).json({ error: 'Reason is required for rejection' });
        }
        approvalProcess.department_approval.reason = reason;
        approvalProcess.status = 'Rejected';

        await ApprovalController.notifyInstructor(approvalProcess.requested_by, `Your grade request has been rejected by the department: ${reason}`);
      } else if (status === 'Approved') {
        approvalProcess.status = 'Pending';
        approvalProcess.department_approval.reason = reason || '';

      }

      await approvalProcess.save();
      return res.status(200).json({ message: 'Department approval updated', approvalProcess });

    } catch (error) {
      console.error('Error updating department approval:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Approve or reject grade by dean
  static async deanApproval(req: Request, res: Response) {
    const { approvalId } = req.params;
    const { status, by, reason } = req.body;

    try {
      // Find the approval process document
      const approvalProcess = await ApprovalProcess.findById(approvalId);
      if (!approvalProcess) {
        return res.status(404).json({ error: 'Approval process not found' });
      }

      if (approvalProcess.department_approval.status !== 'Approved') {
        return res.status(400).json({ error: 'Cannot approve grade by dean before department approval' });
      }

      // Update dean approval
      approvalProcess.dean_approval.status = status;
      approvalProcess.dean_approval.by = new mongoose.Types.ObjectId(by);
      if (status === 'Rejected') {
        if (!reason) {
          return res.status(400).json({ error: 'Reason is required for rejection' });
        }
        approvalProcess.dean_approval.reason = reason;
        approvalProcess.status = 'Rejected';

        // Notify the instructor
        await ApprovalController.notifyInstructor(approvalProcess.requested_by, `Your grade request has been rejected by the dean: ${reason}`);
      } else if (status === 'Approved') {
        approvalProcess.status = 'Approved';
        approvalProcess.dean_approval.reason = reason || '';
        // Notify the instructor
        await ApprovalController.notifyInstructor(approvalProcess.requested_by, 'Your grade request has been approved by the dean.');
      }

      await approvalProcess.save();
      return res.status(200).json({ message: 'Dean approval updated', approvalProcess });

    } catch (error) {
      console.error('Error updating dean approval:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Approve all grades in bulk by department
  static async bulkDepartmentApproval(req: Request, res: Response) {
    const { gradeIds, by } = req.body;

    try {
      // Update department approval for all grades
      const approvalProcesses = await ApprovalProcess.updateMany(
        { grade_id: { $in: gradeIds } },
        {
          $set: {
            'department_approval.status': 'Approved',
            'department_approval.by': new mongoose.Types.ObjectId(by),
            status: 'Pending',
          },
        }
      );

      return res.status(200).json({ message: `Department approval updated for ${gradeIds.length} grades`, approvalProcesses });

    } catch (error) {
      console.error('Error updating department approval in bulk:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Approve all grades in bulk by dean
  static async bulkDeanApproval(req: Request, res: Response) {
    const { gradeIds, by } = req.body;

    try {
      // Update dean approval for all grades
      const approvalProcesses = await ApprovalProcess.updateMany(
        {
          grade_id: { $in: gradeIds },
          'department_approval.status': 'Approved',
        },
        {
          $set: {
            'dean_approval.status': 'Approved',
            'dean_approval.by': new mongoose.Types.ObjectId(by),
            status: 'Approved',
          },
        }
      );

      return res.status(200).json({ message: `Dean approval updated for ${gradeIds.length} grades`, approvalProcesses });

    } catch (error) {
      console.error('Error updating dean approval in bulk:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get approval status by approval ID
  static async getApprovalStatus(req: Request, res: Response) {
    const { approvalId } = req.params;

    try {
      const approvalProcess = await ApprovalProcess.findById(approvalId).populate('grade_id');

      if (!approvalProcess) {
        return res.status(404).json({ error: 'Approval process not found' });
      }

      return res.status(200).json(approvalProcess);
    } catch (error) {
      console.error('Error fetching approval status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get approval status by grade ID
  static async getApprovalStatusByGrade(req: Request, res: Response) {
    const { gradeId } = req.params;

    try {
      const approvalProcess = await ApprovalProcess.findOne({ grade_id: gradeId }).populate('grade_id');

      if (!approvalProcess) {
        return res.status(404).json({ error: 'Approval process not found' });
      }

      return res.status(200).json(approvalProcess);
    } catch (error) {
      console.error('Error fetching approval status by grade ID:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default ApprovalController;