class NhanVien {
  tknv = ""; // tài khoản nhân viên
  name = ""; // tên nv
  email = ""; // email
  password = ""; // mật khẩu
  datepicker = ""; // ngày làm
  luongCB = ""; // lương cơ bản
  chucvu = ""; // chức vụ
  gioLam = ""; // giờ làm

  // phương thức tính tổng lương
  tinhTongLuong = function () {
    if (this.chucvu === "Sep") {
      return this.luongCB * 3;
    } else if (this.chucvu === "truongPhong") {
      return this.luongCB * 2;
    } else if (this.chucvu === "nhanVien") {
      return this.luongCB;
    } else {
      return 0;
    }
  };

  // phương thức xếp loại nhân viên
  xepLoai = function () {
    if (this.gioLam >= 192) {
      return "nhân viên xuất sắc";
    } else if (this.gioLam >= 176) {
      return "nhân viên giỏi";
    } else if (this.gioLam >= 160) {
      return "nhân viên khá";
    } else {
      return "nhân viên trung bình";
    }
  };
}
