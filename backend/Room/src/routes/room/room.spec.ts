const request = require("supertest");
// import mongocoonnect from "../../services/DB/mongo";
// import mongoose from "mongoose";

// Assuming your server is running on port 3000 (replace if different)
const baseUrl = "http://localhost:4000";

describe("Room Management", () => {
  // Sample room data
  // beforeAll(async () => {
  //   await mongocoonnect();
  // });
  // afterAll(async () => {
  //   await mongoose.disconnect();
  // });
  const roomData = [
    {
      room_number: "101",
      block: "A",
    },
    {
      room_number: "102",
      block: "B",
    },
  ];

  describe("Create Room", () => {
    it("should create a room successfully", async () => {
      const response = await request(baseUrl)
        .post("/rooms")
        .set("Content-Type", "application/json")
        .send({ data: roomData });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Rooms created successfully"
      );
      expect(response.body).toHaveProperty("rooms");
      // expect(response.body.rooms).toContain(roomData); // Verify created room matches data
    });

    it("should return a 400 error for missing data", async () => {
      const response = await request(baseUrl)
        .post("/rooms")
        .set("Content-Type", "application/json")
        .send({}); // Empty body

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message"); // Expect error message
    });
  });

  describe("Get All Rooms", () => {
    it("should retrieve all rooms", async () => {
      const response = await request(baseUrl).get("/rooms");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("rooms"); // Expect an array of rooms
    });
  });

  describe("Get Room by ID", () => {
    let createdRoomId;
    let createdRoom;

    beforeEach(async () => {
      // Create a room before each test in this section
      const createResponse = await request(baseUrl)
        .get("/rooms")
        .set("Content-Type", "application/json");

      // console.log(createResponse);
      createdRoomId = createResponse.body.rooms[0]._id; // Assuming ID property in response
      createdRoom = createResponse.body.rooms[0];
    });

    it("should retrieve a room by its ID", async () => {
      const response = await request(baseUrl).get(`/rooms/${createdRoomId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.room).toMatchObject(createdRoom); // Verify retrieved room matches data
    });

    it("should return a 404 error for a non-existent ID", async () => {
      const invalidId = "663a8a581f5ac9b894756339";
      const response = await request(baseUrl).get(`/rooms/${invalidId}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "Room not found");
    });
  });
  describe("Update Room", () => {
    let createdRoomId;
    beforeEach(async () => {
      // Create a room before each test in this section
      const createResponse = await request(baseUrl)
        .get("/rooms")
        .set("Content-Type", "application/json");

      // console.log(createResponse);
      createdRoomId = createResponse.body.rooms[0]._id; // Assuming ID property in response
      createdRoom = createResponse.body.rooms[0];
    });

    it("should update a room successfully", async () => {
      const updatedData = {
        room_number: 202,
        block: "B",
      };

      const response = await request(baseUrl)
        .patch(`/rooms/${createdRoomId}`)
        .set("Content-Type", "application/json")
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Room updated successfully"
      );
      // expect(response.body.room).toMatchObject(updatedData); // Verify updated room matches data
    });

    it("should return a 404 error for a non-existent ID", async () => {
      const invalidId = "663a8a581f5ac9b894756339";
      const updatedData = { room_number: 202, block: "B" };

      const response = await request(baseUrl)
        .patch(`/rooms/${invalidId}`)
        .set("Content-Type", "application/json")
        .send(updatedData);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "Room not found");
    });
  });

  describe("Delete Room", () => {
    let createdRoomId;

    beforeEach(async () => {
      // Create a room before each test in this section
      const createResponse = await request(baseUrl)
        .get("/rooms")
        .set("Content-Type", "application/json");

      // console.log(createResponse);
      createdRoomId = createResponse.body.rooms[0]._id; // Assuming ID property in response
      createdRoom = createResponse.body.rooms[0];
    });

    it("should delete a room successfully", async () => {
      const response = await request(baseUrl).delete(`/rooms/${createdRoomId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Room deleted successfully"
      );
    });

    it("should return a 404 error for a non-existent ID", async () => {
      const invalidId = "663a8a581f5ac9b894756339";
      const response = await request(baseUrl).delete(`/rooms/${invalidId}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "Room not found");
    });
  });
});
