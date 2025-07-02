/**
 * Component tóm tắt thông tin chính của khách hàng
 * Hiển thị những thông tin cốt lõi về tính cách và đặc điểm khách hàng
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Heart, 
  Target, 
  UserX, 
  TrendingUp, 
  TrendingDown,
  MessageSquare,
  Save,
  Edit3,
  CheckCircle,
  AlertTriangle,
  StickyNote,
  X,
  Plus,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getValidSelectValue } from '../utils/selectFixer';

/**
 * Interface cho dữ liệu tóm tắt khách hàng
 */
interface CustomerSummaryData {
  personalityType: 'emotional' | 'practical' | 'mixed';
  dreams: string;
  saddestPast: string;
  singleReason: string;
  strengths: string;
  weaknesses: string;
  whatWeToldThem: string;
}

/**
 * Interface cho ghi chú của quản lý
 */
interface ManagerNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  priority: 'low' | 'medium' | 'high';
  type: 'reminder' | 'warning' | 'info';
}

/**
 * Interface cho props của CustomerSummary
 */
interface CustomerSummaryProps {
  customerId: string;
  customerName: string;
  isEditing?: boolean;
  onSave?: () => void;
}

export default function CustomerSummary({ 
  customerId, 
  customerName, 
  isEditing = false,
  onSave 
}: CustomerSummaryProps) {
  const { isManager, currentUser } = useAuth();
  const [summaryData, setSummaryData] = useState<CustomerSummaryData>({
    personalityType: 'mixed',
    dreams: '',
    saddestPast: '',
    singleReason: '',
    strengths: '',
    weaknesses: '',
    whatWeToldThem: ''
  });
  
  const [editMode, setEditMode] = useState(isEditing);
  const [hasData, setHasData] = useState(false);
  const [managerNotes, setManagerNotes] = useState<ManagerNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    type: 'reminder' as 'reminder' | 'warning' | 'info'
  });

  /**
   * Load dữ liệu tóm tắt từ localStorage
   */
  useEffect(() => {
    const savedSummary = localStorage.getItem(`customerSummary_${customerId}`);
    if (savedSummary) {
      const parsed = JSON.parse(savedSummary);
      setSummaryData(parsed);
      setHasData(true);
    }

    // Load manager notes
    loadManagerNotes();
  }, [customerId]);

  /**
   * Load ghi chú của quản lý
   */
  const loadManagerNotes = () => {
    const savedNotes = localStorage.getItem(`managerNotes_${customerId}`);
    if (savedNotes) {
      setManagerNotes(JSON.parse(savedNotes));
    }
  };

  /**
   * Lưu dữ liệu tóm tắt vào localStorage
   */
  const saveSummary = () => {
    localStorage.setItem(`customerSummary_${customerId}`, JSON.stringify(summaryData));
    setEditMode(false);
    setHasData(true);
    if (onSave) onSave();
  };

  /**
   * Cập nhật dữ liệu tóm tắt
   */
  const updateSummaryData = (field: keyof CustomerSummaryData, value: string) => {
    setSummaryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Lấy màu sắc và text cho loại tính cách
   */
  const getPersonalityInfo = (type: string) => {
    switch (type) {
      case 'emotional':
        return { color: 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-pink-200', text: 'Sống Tình Cảm', icon: <Heart className="w-4 h-4" /> };
      case 'practical':
        return { color: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200', text: 'Sống Thực Tế', icon: <Target className="w-4 h-4" /> };
      case 'mixed':
        return { color: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200', text: 'Cân Bằng', icon: <User className="w-4 h-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Chưa Xác Định', icon: <User className="w-4 h-4" /> };
    }
  };

  const personalityInfo = getPersonalityInfo(summaryData.personalityType);

  /**
   * Thêm ghi chú mới
   */
  const addManagerNote = () => {
    if (!newNote.content.trim()) return;

    const note: ManagerNote = {
      id: Date.now().toString(),
      content: newNote.content.trim(),
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.fullName || 'Manager',
      priority: newNote.priority,
      type: newNote.type
    };

    const updatedNotes = [...managerNotes, note];
    setManagerNotes(updatedNotes);
    localStorage.setItem(`managerNotes_${customerId}`, JSON.stringify(updatedNotes));

    // Reset form
    setNewNote({ content: '', priority: 'medium', type: 'reminder' });
    setIsAddingNote(false);
  };

  /**
   * Xóa ghi chú
   */
  const deleteManagerNote = (noteId: string) => {
    const updatedNotes = managerNotes.filter(note => note.id !== noteId);
    setManagerNotes(updatedNotes);
    localStorage.setItem(`managerNotes_${customerId}`, JSON.stringify(updatedNotes));
  };

  /**
   * Lấy màu sắc theo loại ghi chú
   */
  const getNoteColor = (type: string, priority: string) => {
    if (type === 'warning') return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800';
    if (type === 'info') return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-800';
    if (priority === 'high') return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-800';
    if (priority === 'low') return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-800';
    return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-yellow-800';
  };

  /**
   * Lấy icon theo loại ghi chú
   */
  const getNoteIcon = (type: string) => {
    if (type === 'warning') return <AlertTriangle className="w-4 h-4" />;
    if (type === 'info') return <MessageSquare className="w-4 h-4" />;
    return <StickyNote className="w-4 h-4" />;
  };

  /**
   * Kiểm tra xem có dữ liệu hay không
   */
  const hasAnyData = Object.values(summaryData).some(value => 
    value && value.trim().length > 0
  );

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">Tóm Tắt Thông Tin Chính</div>
              <div className="text-sm text-gray-500 font-normal">{customerName}</div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-3">
            {hasAnyData && (
              <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200 px-3 py-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                Đã có dữ liệu
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
              className="h-10 px-4 hover:bg-blue-50"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {editMode ? 'Hủy' : 'Chỉnh sửa'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Manager Notes Section */}
      {(managerNotes.length > 0 || isManager()) && (
        <CardContent className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-blue-600" />
                Ghi Chú Từ Quản Lý
                {managerNotes.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {managerNotes.length}
                  </Badge>
                )}
              </h4>
              
              {isManager() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNote(true)}
                  className="flex items-center gap-2 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Ghi Chú
                </Button>
              )}
            </div>

            {/* Existing Notes */}
            {managerNotes.length > 0 && (
              <div className="space-y-3">
                {managerNotes.map((note) => (
                  <Alert key={note.id} className={`${getNoteColor(note.type, note.priority)} relative shadow-sm`}>
                    <div className="flex items-start gap-3">
                      {getNoteIcon(note.type)}
                      <div className="flex-1">
                        <AlertDescription className="text-sm font-medium leading-relaxed">
                          {note.content}
                        </AlertDescription>
                        <div className="flex items-center gap-3 mt-3 text-xs">
                          <Badge variant="outline" className="bg-white/50">
                            {note.createdBy}
                          </Badge>
                          <span className="text-gray-600">
                            {new Date(note.createdAt).toLocaleString('vi-VN')}
                          </span>
                          <Badge variant="secondary" className="bg-white/50">
                            {note.priority === 'high' ? 'Cao' : note.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                          </Badge>
                        </div>
                      </div>
                      
                      {isManager() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteManagerNote(note.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {/* Add New Note Form */}
            {isAddingNote && isManager() && (
              <div className="space-y-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Nội dung ghi chú</label>
                  <Textarea
                    placeholder="Nhập ghi chú nhắc nhở cho nhân viên..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="bg-gray-50/50 border-0 focus:bg-white transition-colors"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Loại ghi chú</label>
                    <Select value={getValidSelectValue(newNote.type, 'reminder')} onValueChange={(value: 'reminder' | 'warning' | 'info') => setNewNote({ ...newNote, type: value })}>
                      <SelectTrigger className="h-10 bg-gray-50/50 border-0 focus:bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">📝 Nhắc nhở</SelectItem>
                        <SelectItem value="warning">⚠️ Cảnh báo</SelectItem>
                        <SelectItem value="info">💡 Thông tin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Mức độ ưu tiên</label>
                    <Select value={getValidSelectValue(newNote.priority, 'medium')} onValueChange={(value: 'low' | 'medium' | 'high') => setNewNote({ ...newNote, priority: value })}>
                      <SelectTrigger className="h-10 bg-gray-50/50 border-0 focus:bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Thấp</SelectItem>
                        <SelectItem value="medium">🟡 Trung bình</SelectItem>
                        <SelectItem value="high">🔴 Cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote({ content: '', priority: 'medium', type: 'reminder' });
                    }}
                    className="px-6"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={addManagerNote}
                    disabled={!newNote.content.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu Ghi Chú
                  </Button>
                </div>
              </div>
            )}

            {managerNotes.length === 0 && !isManager() && (
              <div className="text-center py-8 text-gray-500">
                <StickyNote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium">Chưa có ghi chú nào từ quản lý</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
      
      <CardContent className="space-y-6 p-6">
        {/* Loại tính cách */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <Heart className="w-4 h-4 text-pink-500" />
            Khách hàng là người sống tình cảm hay thực tế?
          </label>
          {editMode ? (
            <Select 
              value={getValidSelectValue(summaryData.personalityType, 'mixed')} 
              onValueChange={(value) => updateSummaryData('personalityType', value)}
            >
              <SelectTrigger className="h-12 bg-gray-50/50 border-0 focus:bg-white transition-colors">
                <SelectValue placeholder="Chọn loại tính cách..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emotional">💖 Sống Tình Cảm</SelectItem>
                <SelectItem value="practical">🎯 Sống Thực Tế</SelectItem>
                <SelectItem value="mixed">⚖️ Cân Bằng (Vừa Tình Cảm Vừa Thực Tế)</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge className={`${personalityInfo.color} px-4 py-2 text-base font-semibold shadow-sm`}>
              {personalityInfo.icon}
              <span className="ml-2">{personalityInfo.text}</span>
            </Badge>
          )}
        </div>

        {/* Grid Layout for Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ước mơ */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
              <Target className="w-4 h-4 text-blue-500" />
              Ước mơ là gì?
            </label>
            {editMode ? (
              <Textarea
                placeholder="Nhập ước mơ, hoài bão, mục tiêu lớn của khách hàng..."
                value={summaryData.dreams}
                onChange={(e) => updateSummaryData('dreams', e.target.value)}
                className="min-h-[120px] bg-gray-50/50 border-0 focus:bg-white transition-colors resize-none"
              />
            ) : (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <p className="text-sm leading-relaxed text-gray-700">
                  {summaryData.dreams || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                </p>
              </div>
            )}
          </div>

          {/* Quá khứ buồn nhất */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Quá khứ buồn nhất là gì?
            </label>
            {editMode ? (
              <Textarea
                placeholder="Nhập những tổn thương, mất mát, biến cố buồn nhất trong quá khứ..."
                value={summaryData.saddestPast}
                onChange={(e) => updateSummaryData('saddestPast', e.target.value)}
                className="min-h-[120px] bg-gray-50/50 border-0 focus:bg-white transition-colors resize-none"
              />
            ) : (
              <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100">
                <p className="text-sm leading-relaxed text-gray-700">
                  {summaryData.saddestPast || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                </p>
              </div>
            )}
          </div>

          {/* Lý do độc thân */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
              <UserX className="w-4 h-4 text-purple-500" />
              Lý do độc thân
            </label>
            {editMode ? (
              <Textarea
                placeholder="Nhập lý do tại sao khách hàng hiện tại độc thân, chưa kết hôn..."
                value={summaryData.singleReason}
                onChange={(e) => updateSummaryData('singleReason', e.target.value)}
                className="min-h-[120px] bg-gray-50/50 border-0 focus:bg-white transition-colors resize-none"
              />
            ) : (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                <p className="text-sm leading-relaxed text-gray-700">
                  {summaryData.singleReason || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                </p>
              </div>
            )}
          </div>

          {/* Điểm mạnh */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Điểm mạnh của khách
            </label>
            {editMode ? (
              <Textarea
                placeholder="Nhập những điểm mạnh, ưu điểm của khách hàng..."
                value={summaryData.strengths}
                onChange={(e) => updateSummaryData('strengths', e.target.value)}
                className="min-h-[120px] bg-gray-50/50 border-0 focus:bg-white transition-colors resize-none"
              />
            ) : (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                <p className="text-sm leading-relaxed text-gray-700">
                  {summaryData.strengths || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="space-y-6">
          {/* Điểm yếu */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
              <TrendingDown className="w-4 h-4 text-orange-500" />
              Điểm yếu của khách
            </label>
            {editMode ? (
              <Textarea
                placeholder="Nhập những điểm yếu, hạn chế của khách hàng..."
                value={summaryData.weaknesses}
                onChange={(e) => updateSummaryData('weaknesses', e.target.value)}
                className="min-h-[120px] bg-gray-50/50 border-0 focus:bg-white transition-colors resize-none"
              />
            ) : (
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <p className="text-sm leading-relaxed text-gray-700">
                  {summaryData.weaknesses || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                </p>
              </div>
            )}
          </div>

          {/* Những gì đã nói cho khách */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              Mình đã nói cho khách nghe những gì?
            </label>
            {editMode ? (
              <Textarea
                placeholder="Nhập những thông tin, câu chuyện, kinh nghiệm mà bạn đã chia sẻ với khách hàng..."
                value={summaryData.whatWeToldThem}
                onChange={(e) => updateSummaryData('whatWeToldThem', e.target.value)}
                className="min-h-[120px] bg-gray-50/50 border-0 focus:bg-white transition-colors resize-none"
              />
            ) : (
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                <p className="text-sm leading-relaxed text-gray-700">
                  {summaryData.whatWeToldThem || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button 
              onClick={saveSummary} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 h-12 font-semibold shadow-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Lưu Tóm Tắt
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
