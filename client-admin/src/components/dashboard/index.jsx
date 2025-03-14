import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Typography, Statistic, Divider, List, Tag, Progress, Alert } from 'antd';
import { BookOutlined, EyeOutlined, CalendarOutlined, BarChartOutlined, TagOutlined } from '@ant-design/icons';
import { host } from '../../host';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [popularCategories, setPopularCategories] = useState([]);
    const [topViewBooks, setTopViewBooks] = useState([]);
    const [booksByMonth, setBooksByMonth] = useState([]);
    const [publicPrivateRatio, setPublicPrivateRatio] = useState({});
    const [totalBooks, setTotalBooks] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [
                    categoriesResponse,
                    topViewResponse,
                    monthlyBooksResponse,
                    ratioResponse,
                    totalBooksResponse
                ] = await Promise.all([
                    fetch(`http://${host}:3055/v1/api/KDV/get-popular-categories`, {
                        credentials: 'include'
                    }).then(res => res.json()),
                    fetch(`http://${host}:3055/v1/api/KDV/get-top-view-book`, {
                        credentials: 'include'
                    }).then(res => res.json()),
                    fetch(`http://${host}:3055/v1/api/KDV/get-all-book-by-month`, {
                        credentials: 'include'
                    }).then(res => res.json()),
                    fetch(`http://${host}:3055/v1/api/KDV/get-public-private-ratio`, {
                        credentials: 'include'
                    }).then(res => res.json()),
                    fetch(`http://${host}:3055/v1/api/KDV/count-all-book`, {
                        credentials: 'include'
                    }).then(res => res.json())
                ]);

                // Xử lý tỷ lệ tài liệu công khai và riêng tư
                const publicBooks = ratioResponse.metadata.find(item => item.isPublic === 1)?.total || 0;
                const privateBooks = ratioResponse.metadata.find(item => item.isPublic === 0)?.total || 0;
                setPublicPrivateRatio({
                    public: publicBooks,
                    private: privateBooks
                });

                // Xử lý danh mục phổ biến
                setPopularCategories(categoriesResponse.metadata.map(item => ({
                    name: item.name_category,
                    count: item.total
                })));

                // Xử lý tài liệu xem nhiều nhất
                setTopViewBooks(topViewResponse.metadata.map(item => ({
                    title: item.title,
                    views: item.num_of_views
                })));

                // Xử lý tài liệu theo tháng
                setBooksByMonth(monthlyBooksResponse.metadata.map(item => ({
                    month: item.month,
                    count: item.total
                })));

                setTotalBooks(totalBooksResponse.metadata[0].SUM || 0);
                setError(null);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div style={ { textAlign: 'center', padding: '50px' } }>
                <Spin size="large" />
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return <Alert type="error" message={ error } banner />;
    }

    return (
        <div className="dashboard-container" style={ { padding: '20px' } }>
            <Title level={ 2 }>Thống kê Tài liệu</Title>
            <Divider />

            <Row gutter={ [16, 16] }>
                <Col xs={ 24 } sm={ 24 } md={ 8 }>
                    <Card>
                        <Statistic
                            title="Tổng Số Tài liệu"
                            value={ totalBooks }
                            prefix={ <BookOutlined /> }
                        />
                    </Card>
                </Col>
                <Col xs={ 24 } sm={ 24 } md={ 16 }>
                    <Card title="Tỷ Lệ Tài liệu Công Khai và Riêng Tư">
                        <Progress
                            percent={ Math.round((publicPrivateRatio.public / (publicPrivateRatio.public + publicPrivateRatio.private)) * 100) || 0 }

                        />
                        <div style={ { display: 'flex', justifyContent: 'space-between' } }>
                            <Text type="secondary">
                                { publicPrivateRatio.public || 0 } Tài liệu công khai
                            </Text>
                            <Text type="secondary">
                                { publicPrivateRatio.private || 0 } Tài liệu riêng tư
                            </Text>
                        </div>

                    </Card>
                </Col>
            </Row>

            <Row gutter={ [16, 16] } style={ { marginTop: '16px' } }>
                <Col xs={ 24 } sm={ 24 } md={ 12 }>
                    <Card
                        title={ <><TagOutlined /> Danh Mục Phổ Biến</> }
                        style={ { height: '400px', overflow: 'auto' } }
                    >
                        <List
                            dataSource={ popularCategories }
                            renderItem={ item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={ item.name }
                                        description={ `${item.count || 0} tài liệu` }
                                    />
                                    <Tag color="blue">{ Math.round((item.count / totalBooks) * 100) }%</Tag>
                                </List.Item>
                            ) }
                        />
                    </Card>
                </Col>
                <Col xs={ 24 } sm={ 24 } md={ 12 }>
                    <Card
                        title={ <><EyeOutlined /> Tài liệu Xem Nhiều Nhất</> }
                        style={ { height: '400px', overflow: 'auto' } }
                    >
                        <List
                            dataSource={ topViewBooks }
                            renderItem={ item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={ item.title }
                                        description=""
                                    />
                                    <Text>{ item.views || 0 } lượt xem</Text>
                                </List.Item>
                            ) }
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={ [16, 16] } style={ { marginTop: '16px' } }>
                <Col span={ 24 }>
                    <Card title={ <><CalendarOutlined /> Tài liệu Xuất Bản Theo Tháng</> }>
                        <div style={ { width: '100%', height: 400 } }>
                            <ResponsiveContainer>
                                <BarChart
                                    data={ booksByMonth }
                                    margin={ {
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    } }
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" name="Số lượng tài liệu" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
