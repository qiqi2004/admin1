/**
 * Context quản lý authentication và phân quyền người dùng
 * Xử lý đăng nhập, đăng xuất và quản lý thông tin user
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DeviceManager, DeviceSession } from '../utils/deviceManager';

/**
 * Interface cho thông tin người dùng
 */
interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'manager' | 'employee';
  groupId?: string;
  email: string;
  accessKey: string;
  createdAt: string;
  isActive: boolean;
}

/**
 * Interface cho thông tin nhóm
 */
interface Group {
  id: string;
  name: string;
  description: string;
  managerId: string;
  createdAt: string;
  isActive: boolean;
}

/**
 * Interface cho AuthContext
 */
interface AuthContextType {
  currentUser: User | null;
  currentGroup: Group | null;
  currentDevice: DeviceSession | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isManager: () => boolean;
  isEmployee: () => boolean;
  getAllUsers: () => User[];
  getAllGroups: () => Group[];
  createGroup: (name: string, description: string) => void;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'accessKey'>) => void;
  generateAccessKey: () => string;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  getUserDevices: () => DeviceSession[];
  logoutDevice: (deviceId: string) => void;
  logoutAllDevices: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook để sử dụng AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Provider component cho AuthContext
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [currentDevice, setCurrentDevice] = useState<DeviceSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load dữ liệu từ localStorage khi khởi tạo
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedGroup = localStorage.getItem('currentGroup');
    const savedDeviceId = localStorage.getItem('currentDeviceId');
    
    if (savedUser && savedDeviceId) {
      const user = JSON.parse(savedUser);
      
      // Kiểm tra session có hợp lệ không
      if (DeviceManager.isValidSession(user.id, savedDeviceId)) {
        setCurrentUser(user);
        
        // Cập nhật hoạt động
        DeviceManager.updateActivity(savedDeviceId);
        
        // Load device info
        const deviceSession = DeviceManager.getCurrentDeviceSession(user.id);
        setCurrentDevice(deviceSession);
        
        if (savedGroup) {
          setCurrentGroup(JSON.parse(savedGroup));
        } else if (user.groupId) {
          // Tìm group của user
          const groups = getAllGroups();
          const userGroup = groups.find(g => g.id === user.groupId);
          if (userGroup) {
            setCurrentGroup(userGroup);
            localStorage.setItem('currentGroup', JSON.stringify(userGroup));
          }
        }
      } else {
        // Session không hợp lệ, xóa dữ liệu local
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentGroup');
        localStorage.removeItem('currentDeviceId');
      }
    }
    
    // Tạo tài khoản admin mặc định nếu chưa có
    initializeDefaultAccounts();
    
    // Dọn dẹp sessions cũ
    DeviceManager.cleanupOldSessions();
    
    setIsLoading(false);
  }, []);

  /**
   * Tạo access key ngẫu nhiên (4 số)
   */
  const generateAccessKey = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  /**
   * Tạo tài khoản mặc định
   */
  const initializeDefaultAccounts = () => {
    const users = getAllUsers();
    const existingPasswords = JSON.parse(localStorage.getItem('passwords') || '{}');
    
    if (users.length === 0 || Object.keys(existingPasswords).length === 0) {
      console.log('Creating default accounts...');
      
      // Tạo tài khoản manager mặc định
      const defaultManager: User = {
        id: 'manager_001',
        username: 'admin',
        fullName: 'Quản Lý Hệ Thống',
        role: 'manager',
        email: 'admin@company.com',
        accessKey: '1234',
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Tạo nhóm mặc định
      const defaultGroup: Group = {
        id: 'group_001',
        name: 'Nhóm Chăn Bò Chính',
        description: 'Nhóm chăn bò chính của công ty',
        managerId: defaultManager.id,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      defaultManager.groupId = defaultGroup.id;

      // Tạo tài khoản employee mẫu
      const defaultEmployee: User = {
        id: 'employee_001',
        username: 'nhanvien1',
        fullName: 'Nhân Viên Mẫu',
        role: 'employee',
        groupId: defaultGroup.id,
        email: 'nhanvien1@company.com',
        accessKey: generateAccessKey(),
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Lưu vào localStorage
      localStorage.setItem('users', JSON.stringify([defaultManager, defaultEmployee]));
      localStorage.setItem('groups', JSON.stringify([defaultGroup]));
      
      // Tạo mật khẩu mặc định (trong thực tế nên mã hóa)
      const passwords = {
        'admin': 'admin123',
        'nhanvien1': 'nv123'
      };
      localStorage.setItem('passwords', JSON.stringify(passwords));
      
      console.log('Default accounts created:', passwords);
    } else {
      console.log('Default accounts already exist');
    }
  };

  /**
   * Đăng nhập
   */
  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Đảm bảo tài khoản mặc định được tạo
      initializeDefaultAccounts();
      
      // Giả lập delay API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getAllUsers();
      const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
      
      console.log('Users:', users);
      console.log('Passwords:', passwords);
      console.log('Trying to login with:', username, password);
      
      const user = users.find(u => u.username === username && u.isActive);
      const isPasswordValid = passwords[username] === password;
      
      console.log('Found user:', user);
      console.log('Password valid:', isPasswordValid);
      
      if (!user) {
        return { success: false, message: 'Tài khoản không tồn tại hoặc đã bị khóa!' };
      }
      
      if (!isPasswordValid) {
        return { success: false, message: 'Mật khẩu không đúng!' };
      }

      // Tạo device session
      const deviceResult = DeviceManager.createSession(user.id);
      if (!deviceResult.success) {
        return { success: false, message: deviceResult.message };
      }

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('currentDeviceId', deviceResult.deviceId!);
      
      // Load device info
      const deviceSession = DeviceManager.getCurrentDeviceSession(user.id);
      setCurrentDevice(deviceSession);
      
      // Load group nếu user có groupId
      if (user.groupId) {
        const groups = getAllGroups();
        const userGroup = groups.find(g => g.id === user.groupId);
        if (userGroup) {
          setCurrentGroup(userGroup);
          localStorage.setItem('currentGroup', JSON.stringify(userGroup));
        }
      }
      
      return { success: true, message: 'Đăng nhập thành công!' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Có lỗi xảy ra khi đăng nhập!' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Đăng xuất
   */
  const logout = () => {
    const deviceId = localStorage.getItem('currentDeviceId');
    if (deviceId) {
      DeviceManager.removeSession(deviceId);
    }
    
    setCurrentUser(null);
    setCurrentGroup(null);
    setCurrentDevice(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentGroup');
    localStorage.removeItem('currentDeviceId');
  };

  /**
   * Lấy danh sách thiết bị của user
   */
  const getUserDevices = (): DeviceSession[] => {
    if (!currentUser) return [];
    return DeviceManager.getUserSessions(currentUser.id);
  };

  /**
   * Đăng xuất thiết bị cụ thể
   */
  const logoutDevice = (deviceId: string) => {
    DeviceManager.removeSession(deviceId);
    
    // Nếu là thiết bị hiện tại thì đăng xuất luôn
    const currentDeviceId = localStorage.getItem('currentDeviceId');
    if (currentDeviceId === deviceId) {
      logout();
    }
  };

  /**
   * Đăng xuất tất cả thiết bị
   */
  const logoutAllDevices = () => {
    if (currentUser) {
      DeviceManager.removeAllUserSessions(currentUser.id);
      logout();
    }
  };

  /**
   * Kiểm tra quyền manager
   */
  const isManager = () => currentUser?.role === 'manager';

  /**
   * Kiểm tra quyền employee
   */
  const isEmployee = () => currentUser?.role === 'employee';

  /**
   * Lấy tất cả users
   */
  const getAllUsers = (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  /**
   * Lấy tất cả groups
   */
  const getAllGroups = (): Group[] => {
    const groups = localStorage.getItem('groups');
    return groups ? JSON.parse(groups) : [];
  };

  /**
   * Tạo nhóm mới
   */
  const createGroup = (name: string, description: string) => {
    const groups = getAllGroups();
    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name,
      description,
      managerId: currentUser?.id || '',
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    groups.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groups));
  };

  /**
   * Tạo user mới
   */
  const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'accessKey'>) => {
    const users = getAllUsers();
    const newUser: User = {
      ...userData,
      id: `${userData.role}_${Date.now()}`,
      accessKey: generateAccessKey(),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
  };

  /**
   * Cập nhật user
   */
  const updateUser = (userId: string, userData: Partial<User>) => {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem('users', JSON.stringify(users));
      
      // Cập nhật current user nếu đang chỉnh sửa chính mình
      if (currentUser?.id === userId) {
        const updatedUser = users[userIndex];
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  };

  /**
   * Xóa user
   */
  const deleteUser = (userId: string) => {
    const users = getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
  };

  const value: AuthContextType = {
    currentUser,
    currentGroup,
    currentDevice,
    isLoading,
    login,
    logout,
    isManager,
    isEmployee,
    getAllUsers,
    getAllGroups,
    createGroup,
    createUser,
    updateUser,
    deleteUser,
    generateAccessKey,
    getUserDevices,
    logoutDevice,
    logoutAllDevices
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
