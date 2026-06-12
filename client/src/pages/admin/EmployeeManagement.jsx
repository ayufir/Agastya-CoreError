import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFieldOfficers,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../redux/features/auth/authThunks";

const { Option } = Select;

function EmployeeManagement() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.auth.FO);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const { user: currentUser } = useSelector((state) => state.auth);

  const roles = [
    "SuperAdmin",
    "Admin",
    "Coordinator",
    "FieldOfficer",
    "TechnicalManager",
    "RegionalManager",
    "Accountant",
  ];

  const availableRoles = currentUser?.role === "SuperAdmin" 
    ? roles 
    : roles.filter(role => !["SuperAdmin", "Admin"].includes(role));

  useEffect(() => {
    dispatch(fetchFieldOfficers());
  }, [dispatch]);

  const showModal = (record = null) => {
    setEditingEmployee(record);
    if (record) {
      form.setFieldsValue({
        name: record.name,
        email: record.email,
        role: record.role,
        assignedCity: record.assignedCity,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleFinish = async (values) => {
    try {
      if (editingEmployee) {
        // Update
        await dispatch(
          updateEmployee({ id: editingEmployee._id, data: values })
        ).unwrap();
        message.success("Employee updated successfully");
      } else {
        // Add
        await dispatch(addEmployee(values)).unwrap();
        message.success("Employee added successfully");
      }
      handleCancel();
      dispatch(fetchFieldOfficers()); // Refresh list
    } catch (err) {
      message.error("Something went wrong");
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    console.log(id, "LIOn");

    Modal.confirm({
      title: "Are you sure you want to delete this employee?",
      onOk: async () => {
        try {
          await dispatch(deleteEmployee(id)).unwrap();
          message.success("Employee deleted");
          dispatch(fetchFieldOfficers());
        } catch (err) {
          message.error("Failed to delete");
          console.error(err);
        }
      },
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span style={{ color: isActive ? "green" : "red" }}>
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Assigned City",
      dataIndex: "assignedCity",
      key: "assignedCity",
      render: (city) => city || "All Cities",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type='link' onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type='link' danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Employee Management</h2>
      <Button
        type='primary'
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        + Add Employee
      </Button>
      <Table dataSource={employees} columns={columns} rowKey='_id' />

      <Modal
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingEmployee ? "Update" : "Add"}
      >
        <Form form={form} layout='vertical' onFinish={handleFinish}>
          <Form.Item name='name' label='Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          {editingEmployee ? (
            ""
          ) : (
            <Form.Item
              name='password'
              label='Password'
              rules={[{ required: true, type: "password" }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item name='role' label='Role' rules={[{ required: true }]}>
            <Select placeholder='Select Role'>
              {availableRoles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='assignedCity' label='Assigned City/Zone'>
            <Select placeholder='Select City (Leave empty for All)'>
              <Option value=''>All Cities</Option>
              <Option value='Bhopal'>Bhopal</Option>
              <Option value='Indore'>Indore</Option>
              <Option value='Jabalpur'>Jabalpur</Option>
              <Option value='Gwalior'>Gwalior</Option>
              <Option value='Dehradun'>Dehradun</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EmployeeManagement;
