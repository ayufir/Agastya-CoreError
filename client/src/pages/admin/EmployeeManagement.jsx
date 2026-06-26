import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Select, Popconfirm, Divider, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchFieldOfficers,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../redux/features/auth/authThunks";

const { Option, OptGroup } = Select;

function EmployeeManagement() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.auth.FO);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [customCities, setCustomCities] = useState([]);
  const [newCityName, setNewCityName] = useState("");

  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // 🔒 Only SuperAdmin can access this page
  if (currentUser && currentUser.role !== "SuperAdmin") {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 16
      }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ color: "#dc2626", fontWeight: 700, fontSize: 22 }}>Access Denied</h2>
        <p style={{ color: "#64748b", fontSize: 15 }}>Yeh page sirf SuperAdmin ke liye hai.</p>
        <Button type="primary" onClick={() => navigate("/")}>Dashboard par Jao</Button>
      </div>
    );
  }

  const roles = [
    "SuperAdmin",
    "Admin",
    "Coordinator",
    "FieldOfficer",
    "TechnicalManager",
    "RegionalManager",
    "Accountant",
  ];

  const availableRoles = currentUser?.role !== "FieldOfficer" && currentUser?.role !== "FIELDOFFICER" 
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

  const onCityNameChange = (e) => {
    setNewCityName(e.target.value);
  };

  const addCustomCity = (e) => {
    e.preventDefault();
    const trimmed = newCityName.trim();
    if (!trimmed) return;

    const defaultCities = ["Bhopal", "Jabalpur", "Gwalior", "Indore", "Dehradun"];
    const allExisting = [
      ...defaultCities,
      ...customCities,
      ...(employees ? employees.map(emp => emp.assignedCity).filter(Boolean) : [])
    ];

    if (allExisting.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      message.warning("City already exists!");
      return;
    }

    setCustomCities([...customCities, trimmed]);
    setNewCityName("");
  };

  const handleFinish = async (values) => {
    try {
      const payload = { ...values };
      // If editing and password is empty, remove it from the payload to avoid overwriting
      if (editingEmployee && (!payload.password || payload.password.trim() === "")) {
        delete payload.password;
      }

      if (editingEmployee) {
        // Update
        await dispatch(
          updateEmployee({ id: editingEmployee._id, data: payload })
        ).unwrap();
        message.success("Employee updated successfully");
      } else {
        // Add
        await dispatch(addEmployee(payload)).unwrap();
        message.success("Employee added successfully");
      }
      handleCancel();
      dispatch(fetchFieldOfficers()); // Refresh list
    } catch (err) {
      message.error(err || "Something went wrong");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      message.success("Employee deleted successfully");
      dispatch(fetchFieldOfficers());
    } catch (err) {
      message.error(err || "Failed to delete");
      console.error(err);
    }
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
          {currentUser?.role === "SuperAdmin" && (
            <Popconfirm
              title="Are you sure you want to delete this employee?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type='link' danger>
                Delete
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  const defaultCities = ["Bhopal", "Jabalpur", "Gwalior", "Indore", "Dehradun"];
  const otherCities = [
    ...customCities,
    ...(employees 
      ? employees.map(emp => emp.assignedCity).filter(c => c && !defaultCities.includes(c) && !customCities.includes(c))
      : []
    )
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
          {(!editingEmployee || (currentUser?.role !== "FieldOfficer" && currentUser?.role !== "FIELDOFFICER")) && (
            <Form.Item
              name='password'
              label={editingEmployee ? 'New Password (leave blank to keep current)' : 'Password'}
              rules={editingEmployee ? [] : [{ required: true, message: 'Password is required' }]}
            >
              <Input.Password placeholder={editingEmployee ? "Enter new password" : "Enter password"} />
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
            <Select
              placeholder='Select City (Leave empty for All)'
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: '0 8px 4px', gap: '8px' }}>
                    <Input
                      placeholder="Add custom city"
                      value={newCityName}
                      onChange={onCityNameChange}
                      onKeyDown={(e) => e.stopPropagation()}
                      style={{ flex: 'auto' }}
                    />
                    <Button type="primary" onClick={addCustomCity}>
                      + Add
                    </Button>
                  </div>
                </>
              )}
            >
              <Option value=''>All Cities</Option>
              <OptGroup label="Central Portal (Bhopal, Jabalpur, Gwalior)">
                <Option value='Bhopal'>Bhopal</Option>
                <Option value='Jabalpur'>Jabalpur</Option>
                <Option value='Gwalior'>Gwalior</Option>
              </OptGroup>
              <OptGroup label="Indore Portal">
                <Option value='Indore'>Indore</Option>
              </OptGroup>
              <OptGroup label="Dehradun Portal">
                <Option value='Dehradun'>Dehradun</Option>
              </OptGroup>
              {otherCities.length > 0 && (
                <OptGroup label="Custom/Other Cities">
                  {otherCities.map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </OptGroup>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EmployeeManagement;
