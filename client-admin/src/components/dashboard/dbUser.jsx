import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Spin, Typography, Alert } from 'antd';
import { UserOutlined, RiseOutlined, BellOutlined, FireOutlined } from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/plots';

const { Title } = Typography;

const DbUser = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersByMonth, setNewUsersByMonth] = useState([]);
  const [totalActions, setTotalActions] = useState(0);
  const [popularActions, setPopularActions] = useState([]);
  const [notifiedUsers, setNotifiedUsers] = useState([]);

  const API_BASE_URL = 'http://localhost:3055/v1/api/admin';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          totalUsersRes,
          newUsersByMonthRes,
          totalActionsRes,
          popularActionsRes,
          notifiedUsersRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/get-total-user`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(res => res.json()),
          fetch(`${API_BASE_URL}/get-new-user-by-month`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(res => res.json()),
          fetch(`${API_BASE_URL}/get-total-action-of-user`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(res => res.json()),
          fetch(`${API_BASE_URL}/get-top-popular-actions`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(res => res.json()),
          fetch(`${API_BASE_URL}/get-top-notified-users`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(res => res.json())
        ]);

        console.log(totalUsersRes);
        console.log(newUsersByMonthRes);
        console.log(totalActionsRes);
        console.log(popularActionsRes);
        console.log(notifiedUsersRes);

        setTotalUsers(totalUsersRes.metadata || 0);
        
        const monthlyData = newUsersByMonthRes.metadata || [];
        setNewUsersByMonth(monthlyData.map(item => ({
          month: item.month,
          count: item.total
        })));
        
        setTotalActions(totalActionsRes.metadata || 0);
        
        const actionsData = popularActionsRes.metadata || [];
        setPopularActions(actionsData.map(item => ({
          action: item.action_type,
          count: item.total
        })));
        
        const notifiedData = notifiedUsersRes.metadata || [];
        setNotifiedUsers(notifiedData.map(item => ({
          id: item.user_id,
          username: item.name,
          email: item.email || 'N/A',
          total_notifications: item.total_notifications
        })));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Có lỗi khi tải dữ liệu dashboard. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Config for new users by month chart
  const newUsersChartConfig = {
    data: newUsersByMonth,
    xField: 'month',
    yField: 'count',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  // Config for popular actions chart
  const popularActionsChartConfig = {
    data: popularActions,
    angleField: 'count',
    colorField: 'action',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const notifiedUsersColumns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số thông báo',
      dataIndex: 'total_notifications',
      key: 'total_notifications',
      sorter: (a, b) => a.total_notifications - b.total_notifications,
    },
   
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải dữ liệu dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon />;
  }

  return (
    <div className="dashboard-container-tk">
      <Title level={2}>Dashboard Người Dùng</Title>
      
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#1890ff' }} />
              <div>
                <p>Tổng số người dùng</p>
                <Title level={3}>{totalUsers}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RiseOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#52c41a' }} />
              <div>
                <p>Người dùng mới tháng này</p>
                <Title level={3}>
                  {newUsersByMonth.length > 0 
                    ? newUsersByMonth[newUsersByMonth.length - 1].count 
                    : 0}
                </Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FireOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#fa8c16' }} />
              <div>
                <p>Tổng số hành động</p>
                <Title level={3}>{totalActions}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BellOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#722ed1' }} />
              <div>
                <p>Người dùng nhận thông báo</p>
                <Title level={3}>{notifiedUsers.length}</Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Người dùng mới theo tháng">
            {newUsersByMonth.length > 0 ? (
              <Line {...newUsersChartConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Không có dữ liệu
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hành động phổ biến">
            {popularActions.length > 0 ? (
              <Pie {...popularActionsChartConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Không có dữ liệu
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card title="Người dùng nhận nhiều thông báo nhất" style={{ marginTop: '24px' }}>
        <Table 
          dataSource={notifiedUsers} 
          columns={notifiedUsersColumns} 
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default DbUser;



