/**
 * Utility để kiểm tra và sửa tất cả Select components
 * Đảm bảo không có SelectItem nào có value rỗng
 */

/**
 * Kiểm tra và trả về giá trị hợp lệ cho Select
 */
export const getValidSelectValue = (value: string | null | undefined, defaultValue: string = 'none'): string => {
  if (!value || value === '') {
    return defaultValue;
  }
  return value;
};

/**
 * Xử lý value change cho Select với placeholder
 */
export const handleSelectChange = (
  value: string, 
  placeholderValue: string = 'none',
  callback: (val: string | null) => void
) => {
  if (value === placeholderValue) {
    callback(null);
  } else {
    callback(value);
  }
};

/**
 * Xử lý filter logic
 */
export const matchesFilter = (itemValue: string, filterValue: string, allValue: string = 'all'): boolean => {
  return filterValue === allValue || itemValue === filterValue;
};
