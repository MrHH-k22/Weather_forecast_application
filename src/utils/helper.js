// Hàm tính giá trị tối đa phù hợp với từng tab
export function getMaxValueForTab(data, tabId) {
  const values = data.map((item) => item.value);
  const maxValue = Math.max(...values);

  // Điều chỉnh theo từng loại dữ liệu
  switch (tabId) {
    case "Wind speed":
      return Math.max(maxValue + 15, 50); // Đảm bảo đủ không gian cho km/h
    case "Humidity":
    case "Cloud cover":
      return 100; // Thang đo cố định 0-100%
    case "Pressure":
      // Tìm phạm vi hợp lý dựa trên giá trị áp suất
      const range = Math.max(maxValue - Math.min(...values), 10);
      return maxValue + Math.round(range * 0.2);
    default:
      return maxValue + 8; // Mặc định thêm 8 đơn vị
  }
}

// Hàm tính giá trị tối thiểu phù hợp với từng tab
export function getMinValueForTab(data, tabId) {
  const values = data.map((item) => item.value);
  const minValue = Math.min(...values);

  // Điều chỉnh theo từng loại dữ liệu
  switch (tabId) {
    case "Wind speed":
      return Math.max(minValue - 5, 0); // Không cho phép giá trị âm
    case "Humidity":
    case "Cloud cover":
      return 0; // Bắt đầu từ 0%
    case "Pressure":
      // Áp suất thường có phạm vi nhỏ, điều chỉnh để hiển thị tốt
      const range = Math.max(Math.max(...values) - minValue, 10);
      return minValue - Math.round(range * 0.1);
    case "Rain/Snow":
      return 0; // Lượng mưa bắt đầu từ 0
    default:
      return minValue - 3; // Mặc định giảm 3 đơn vị
  }
}
