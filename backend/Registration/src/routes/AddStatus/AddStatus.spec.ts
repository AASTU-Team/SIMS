const request = require("supertest");
const app = require("../../app");
const AddStatus = require("../../models/AddStatus.model"); // Assuming the model is imported from a separate file

jest.mock("../../models/AddStatus.model");

describe("AddStatus Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /add-status", () => {
    it("should return all add statuses", async () => {
      const mockStatus = [
        { _id: "123", status: "Active", semester: "456" },
        { _id: "789", status: "Inactive", semester: "012" },
      ];

      AddStatus.find.mockResolvedValue(mockStatus);

      const response = await request(app).get("/add-status");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStatus);
      expect(AddStatus.find).toHaveBeenCalledTimes(1);
    });

    it("should return a 500 error if there is an error", async () => {
      const errorMessage = "Internal Server Error";

      (AddStatus.find as jest.Mock).mockRejectedValue({
        message: errorMessage,
      });

      const response = await request(app).get("/add-status");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessage);
      expect(AddStatus.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /add-status/:id", () => {
    it("should return an add status by ID", async () => {
      const mockStatus = { _id: "123", status: "Active", semester: "456" };

      (AddStatus.findById as jest.Mock).mockResolvedValue(mockStatus);

      const response = await request(app).get("/add-status/123");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStatus);
      expect(AddStatus.findById).toHaveBeenCalledTimes(1);
      expect(AddStatus.findById).toHaveBeenCalledWith({ _id: "123" });
    });

    it("should return a 500 error if there is an error", async () => {
      const errorMessage = "Internal Server Error";

      (AddStatus.findById as jest.Mock).mockRejectedValue({
        message: errorMessage,
      });

      const response = await request(app).get("/add-status/123");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessage);
      expect(AddStatus.findById).toHaveBeenCalledTimes(1);
      expect(AddStatus.findById).toHaveBeenCalledWith({ _id: "123" });
    });
  });
});
