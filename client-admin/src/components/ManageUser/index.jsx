import { useEffect, useState } from 'react';
import { host } from '../../host';
import './manageUser.css';
import { useNavigate } from 'react-router-dom';
import checkAuth from '../../Auth/checkAuth';

export default function ManageUser() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [isValid, setValid] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth(`http://${host}:3055/v1/api/`).then((res) => {
            if (res == false) {
                navigate('/access');
            } else {
                setValid(true);
                fetchUsers();
            }
        });
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://${host}:3055/v1/api/admin/get-all-account`, {
                credentials: 'include'
            });
            const data = await response.json();
            console.log(data);
            if (data.metadata) {
                setUsers(data.metadata);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUpdateRole = async () => {
        try {
            const response = await fetch(`http://${host}:3055/v1/api/admin/update-role?id=${selectedUser.user_id}&role=${newRole}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
              
            });
            console.log(await response.json());
            if (response.ok) {
                await fetchUsers();
                setIsUpdateModalOpen(false);
                alert('Cập nhật quyền thành công!');
            } else {
                alert('Có lỗi xảy ra khi cập nhật quyền!');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Có lỗi xảy ra khi cập nhật quyền!');
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`http://${host}:3055/v1/api/admin/delete-account?id=${selectedUser.user_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                
            });

            if (response.ok) {
                await fetchUsers();
                setIsDeleteModalOpen(false);
                alert('Xóa tài khoản thành công!');
            } else {
                alert('Có lỗi xảy ra khi xóa tài khoản!');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Có lỗi xảy ra khi xóa tài khoản!');
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'A':
                return 'Người dùng';
            case 'B':
                return 'Kiểm duyệt viên';
            case 'C':
                return 'Quản trị viên';
            default:
                return 'Không xác định';
        }
    };

    if (isValid === null) {
        return <p>Loading...</p>;
    }

    if (!isValid) {
        return null;
    }

    return (
        <div className="mu-container">
            <h2>Quản lý tài khoản</h2>
            <table className="mu-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Quyền</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{getRoleName(user.role)}</td>
                            <td className="mu-action-buttons">
                                <button 
                                    className={user.role === 'C' ? 'mu-update-btn disabled' : 'mu-update-btn'}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setNewRole(user.role);
                                        setIsUpdateModalOpen(true);
                                    }}
                                >
                                    Cập nhật quyền
                                </button>
                                <button 
                                    className={user.role === 'C' ? 'mu-delete-btn disabled' : 'mu-delete-btn'}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsDeleteModalOpen(true);
                                    }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal cập nhật quyền */}
            {(isUpdateModalOpen && selectedUser.role !== 'C') && (
                <div className="mu-modal-overlay">
                    <div className="mu-modal">
                        <h2>Cập nhật quyền</h2>
                        <p>Tài khoản: {selectedUser?.user_id}</p>
                        <select 
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <option value="A">Người dùng</option>
                            <option value="B">Kiểm duyệt viên</option>
                        </select>
                        <div className="mu-modal-buttons">
                            <button 
                                className="mu-cancel-btn"
                                onClick={() => setIsUpdateModalOpen(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="mu-confirm-btn"
                                onClick={handleUpdateRole}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận xóa */}
            {(isDeleteModalOpen && selectedUser.role !== 'C') && (
                <div className="mu-modal-overlay">
                    <div className="mu-modal">
                        <h2>Xác nhận xóa</h2>
                        <p>Bạn có chắc chắn muốn xóa tài khoản {selectedUser?.name}?</p>
                        <div className="mu-modal-buttons">
                            <button 
                                className="mu-cancel-btn"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="mu-confirm-btn"
                                onClick={handleDeleteUser}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 