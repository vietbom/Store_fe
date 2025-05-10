import React, { useState, useEffect } from 'react'
import { useUserStore } from '../../apis/User'
import { useAuthStore } from '../../apis/Auth'
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../../lib/axios'

interface UserInfo {
  _id: string;
  MaKH: string;
  userName: string;
  email: string;
  typeCs?: string;
  SDT?: string;
  createdAt?: string;
  updatedAt?: string;
}

const InfoProfile = () => {
  const { user, isAuthenticated } = useAuthStore()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!isAuthenticated || !user?.MaKH) return;
        
        const response = await axiosInstance.get<UserInfo>('/user/profile');
        setUserInfo(response.data);
        setEditedInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put<UserInfo>('/user/profile', {
        userName: editedInfo?.userName,
        email: editedInfo?.email,
        SDT: editedInfo?.SDT
      });
      setUserInfo(response.data);
      setEditedInfo(response.data);
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Error updating user info:', error);
      toast.error('Không thể cập nhật thông tin');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedInfo) return;
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: e.target.value
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Vui lòng đăng nhập để xem thông tin cá nhân</h2>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Thông tin cá nhân</h1>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save size={20} />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X size={20} />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Mã khách hàng */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500">Mã khách hàng</label>
                <div className="mt-1 text-gray-900 font-medium">{userInfo?.MaKH}</div>
              </div>
            </div>

            {/* Tên người dùng */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="text-purple-600" size={24} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500">Tên người dùng</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="userName"
                    value={editedInfo?.userName || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1 text-gray-900 font-medium">{userInfo?.userName}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-3 rounded-full">
                <Mail className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedInfo?.email || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1 text-gray-900 font-medium">{userInfo?.email}</div>
                )}
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-orange-100 p-3 rounded-full">
                <Phone className="text-orange-600" size={24} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="SDT"
                    value={editedInfo?.SDT || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1 text-gray-900 font-medium">
                    {userInfo?.SDT || 'Chưa cập nhật'}
                  </div>
                )}
              </div>
            </div>

            {/* Loại khách hàng */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-yellow-100 p-3 rounded-full">
                <User className="text-yellow-600" size={24} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500">Loại khách hàng</label>
                <div className="mt-1 text-gray-900 font-medium">
                  {userInfo?.typeCs || 'Thành viên thường'}
                </div>
              </div>
            </div>

            {/* Thời gian tạo và cập nhật */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500">Ngày tạo tài khoản</label>
                <div className="mt-1 text-gray-900">
                  {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                <div className="mt-1 text-gray-900">
                  {userInfo?.updatedAt ? new Date(userInfo.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoProfile;
