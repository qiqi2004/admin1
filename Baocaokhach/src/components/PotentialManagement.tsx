/**
 * Component quản lý khách hàng tiềm năng
 * Cho phép đánh giá và ghi chú về khách hàng tiềm năng
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Star, 
  StarOff, 
  Target, 
  Save,
  AlertCircle
} from 'lucide-react';
import { getValidSelectValue } from '../utils/selectFixer';

/**
 * Interface cho props của PotentialManagement
 */
interface PotentialManagementProps {
  customer: any;
  onUpdatePotential: (customerId: string, isPotential: boolean, score?: number, notes?: string) => void;
}

export default function PotentialManagement({ customer, onUpdatePotential }: PotentialManagementProps) {
  const [score, setScore] = useState(customer?.potentialScore?.toString() || '5');
  const [notes, setNotes] = useState(customer?.potentialNotes || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!customer) {
    return null;
  }

  /**
   * Lưu thông tin tiềm năng
   */
  const handleSave = () => {
    const scoreNum = parseInt(score) || 5;
    onUpdatePotential(customer.id, true, scoreNum, notes);
    setIsEditing(false);
  };

  /**
   * Bỏ đánh dấu tiềm năng
   */
  const handleRemovePotential = () => {
    onUpdatePotential(customer.id, false);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-500" />
            Đánh Giá Tiềm Năng
          </span>
          <div className="flex items-center gap-2">
            {customer.isPotential && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                Tiềm năng
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Hủy' : 'Chỉnh sửa'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            {/* Điểm đánh giá */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Điểm tiềm năng (1-10)</label>
              <Select value={getValidSelectValue(score, '5')} onValueChange={setScore}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn điểm..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Rất thấp</SelectItem>
                  <SelectItem value="2">2 - Thấp</SelectItem>
                  <SelectItem value="3">3 - Dưới trung bình</SelectItem>
                  <SelectItem value="4">4 - Trung bình thấp</SelectItem>
                  <SelectItem value="5">5 - Trung bình</SelectItem>
                  <SelectItem value="6">6 - Trung bình cao</SelectItem>
                  <SelectItem value="7">7 - Khá</SelectItem>
                  <SelectItem value="8">8 - Tốt</SelectItem>
                  <SelectItem value="9">9 - Rất tốt</SelectItem>
                  <SelectItem value="10">10 - Xuất sắc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú đánh giá</label>
              <Textarea
                placeholder="Nhập lý do đánh giá, điểm mạnh, tiềm năng của khách hàng..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemovePotential}
              >
                <StarOff className="w-4 h-4 mr-1" />
                Bỏ tiềm năng
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-1" />
                Lưu đánh giá
              </Button>
            </div>
          </>
        ) : (
          <>
            {customer.isPotential ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Điểm tiềm năng:</span>
                  <Badge variant="secondary">
                    {customer.potentialScore || 5}/10
                  </Badge>
                </div>
                
                {customer.potentialNotes && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Ghi chú:</strong> {customer.potentialNotes}
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Đánh dấu tiềm năng: {new Date(customer.lastUpdated).toLocaleString('vi-VN')}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-4">
                  Khách hàng này chưa được đánh dấu là tiềm năng
                </p>
                <Button onClick={() => setIsEditing(true)}>
                  <Star className="w-4 h-4 mr-1" />
                  Đánh dấu tiềm năng
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
