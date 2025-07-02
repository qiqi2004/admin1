/**
 * Device Manager - Quản lý phiên đăng nhập trên nhiều thiết bị
 * Giới hạn tối đa 3 thiết bị đăng nhập cùng lúc
 */

/**
 * Interface cho Device Session
 */
export interface DeviceSession {
  id: string;
  userId: string;
  deviceInfo: string;
  browser: string;
  os: string;
  loginTime: string;
  lastActivity: string;
  ipAddress?: string;
}

/**
 * Device Manager Class
 */
export class DeviceManager {
  private static readonly MAX_DEVICES = 3;
  private static readonly STORAGE_KEY = 'device_sessions';

  /**
   * Tạo device ID duy nhất
   */
  static generateDeviceId(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = canvas.toDataURL();
    const userAgent = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const combined = `${fingerprint}-${userAgent}-${screen}-${timezone}`;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Lấy thông tin thiết bị hiện tại
   */
  static getDeviceInfo(): { browser: string; os: string; deviceInfo: string } {
    const userAgent = navigator.userAgent;
    
    // Detect browser
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    // Detect OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    // Device info
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const deviceInfo = isMobile ? 'Mobile Device' : 'Desktop';

    return { browser, os, deviceInfo };
  }

  /**
   * Lấy tất cả sessions
   */
  static getAllSessions(): DeviceSession[] {
    const sessions = localStorage.getItem(this.STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  }

  /**
   * Lưu sessions
   */
  static saveSessions(sessions: DeviceSession[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  /**
   * Lấy sessions của user
   */
  static getUserSessions(userId: string): DeviceSession[] {
    return this.getAllSessions().filter(session => session.userId === userId);
  }

  /**
   * Tạo session mới
   */
  static createSession(userId: string): { success: boolean; message: string; deviceId?: string } {
    const deviceId = this.generateDeviceId();
    const deviceInfo = this.getDeviceInfo();
    const now = new Date().toISOString();
    
    const allSessions = this.getAllSessions();
    const userSessions = this.getUserSessions(userId);

    // Kiểm tra xem device này đã đăng nhập chưa
    const existingSession = userSessions.find(session => session.id === deviceId);
    if (existingSession) {
      // Cập nhật last activity
      existingSession.lastActivity = now;
      this.saveSessions(allSessions.map(session => 
        session.id === deviceId ? existingSession : session
      ));
      return { 
        success: true, 
        message: 'Phiên đăng nhập được khôi phục',
        deviceId 
      };
    }

    // Kiểm tra giới hạn thiết bị
    if (userSessions.length >= this.MAX_DEVICES) {
      return { 
        success: false, 
        message: `Chỉ được phép đăng nhập tối đa ${this.MAX_DEVICES} thiết bị cùng lúc!` 
      };
    }

    // Tạo session mới
    const newSession: DeviceSession = {
      id: deviceId,
      userId,
      deviceInfo: deviceInfo.deviceInfo,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      loginTime: now,
      lastActivity: now
    };

    const updatedSessions = [...allSessions, newSession];
    this.saveSessions(updatedSessions);

    return { 
      success: true, 
      message: 'Đăng nhập thành công',
      deviceId 
    };
  }

  /**
   * Xóa session
   */
  static removeSession(deviceId: string): void {
    const allSessions = this.getAllSessions();
    const filteredSessions = allSessions.filter(session => session.id !== deviceId);
    this.saveSessions(filteredSessions);
  }

  /**
   * Xóa tất cả sessions của user
   */
  static removeAllUserSessions(userId: string): void {
    const allSessions = this.getAllSessions();
    const filteredSessions = allSessions.filter(session => session.userId !== userId);
    this.saveSessions(filteredSessions);
  }

  /**
   * Cập nhật hoạt động
   */
  static updateActivity(deviceId: string): void {
    const allSessions = this.getAllSessions();
    const updatedSessions = allSessions.map(session =>
      session.id === deviceId
        ? { ...session, lastActivity: new Date().toISOString() }
        : session
    );
    this.saveSessions(updatedSessions);
  }

  /**
   * Kiểm tra session có hợp lệ không
   */
  static isValidSession(userId: string, deviceId: string): boolean {
    const userSessions = this.getUserSessions(userId);
    return userSessions.some(session => session.id === deviceId);
  }

  /**
   * Dọn dẹp sessions cũ (trên 30 ngày không hoạt động)
   */
  static cleanupOldSessions(): void {
    const allSessions = this.getAllSessions();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeSessions = allSessions.filter(session => {
      const lastActivity = new Date(session.lastActivity);
      return lastActivity > thirtyDaysAgo;
    });

    this.saveSessions(activeSessions);
  }

  /**
   * Lấy thông tin thiết bị hiện tại
   */
  static getCurrentDeviceSession(userId: string): DeviceSession | null {
    const deviceId = this.generateDeviceId();
    const userSessions = this.getUserSessions(userId);
    return userSessions.find(session => session.id === deviceId) || null;
  }
}
