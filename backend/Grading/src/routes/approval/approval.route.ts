import express from 'express';
import ApprovalController from './approval.controller';  // Adjust the path as necessary

const router = express.Router();

// Route to submit a grade for approval
router.post('/submit', ApprovalController.submitForApproval);

// Route to approve or reject grade by department
router.put('/department/:approvalId', ApprovalController.departmentApproval);

// Route to approve or reject grade by dean
router.put('/dean/:approvalId', ApprovalController.deanApproval);

// Route to approve grades in bulk by department
router.post('/department/bulk', ApprovalController.bulkDepartmentApproval);

// Route to approve grades in bulk by dean
router.post('/dean/bulk', ApprovalController.bulkDeanApproval);

// Route to get approval status by approval ID
router.get('/status/:approvalId', ApprovalController.getApprovalStatus);

// Route to get approval status by grade ID
router.get('/status/grade/:gradeId', ApprovalController.getApprovalStatusByGrade);

router.get('/department/requests', ApprovalController.getDepartmentRequests);

router.get('/dean/requests', ApprovalController.getDeanRequests);

export default router;
