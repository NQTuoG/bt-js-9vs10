let arrNhanVien = getLocalStorage();
renderArrNhanVien();

// getValueNhanVien
function getValueNhanVien() {
  let arrField = document.querySelectorAll("#formQLNV input, #formQLNV select");
  // khởi tạo một đối tượng từ lớp đối tượng NhanVien
  let nhanVien = new NhanVien();
  let isValid = true;

  for (let field of arrField) {
    // destructuring
    let { value, id } = field;
    nhanVien[id] = value;

    let dataValidation = field.getAttribute("data-validation");
    console.log(dataValidation);

    let theSpanThongBao = formQLNV.querySelector(`span#${id}`);
    console.log(theSpanThongBao);
    let isEmpty = checkEmptyValue(value, theSpanThongBao); // true false

    isValid &= isEmpty;
    //xử lí nếu dữ liệu rỗng thì sẽ không xử lí bất kỳ hành động nào bên dưới

    if (!isEmpty) {
      continue;
    }
    if (dataValidation == "taikhoan") {
      isValid &= checkTaiKhoan(value, theSpanThongBao, 4, 6);
    } else if (dataValidation == "email") {
      isValid &= checkEmailValue(value, theSpanThongBao);
    } else if (dataValidation == "tenNv") {
      isValid &= checkName(value, theSpanThongBao);
    } else if (dataValidation == "matKhau") {
      isValid &= CheckPassword(value, theSpanThongBao);
    } else if (dataValidation == "luong") {
      isValid &= checkLuong(value, theSpanThongBao, 1000000, 20000000);
    } else if (dataValidation == "gioLam") {
      isValid &= checkLuong(value, theSpanThongBao, 80, 200);
    }
  }

  if (!isValid) {
    return null;
  }
  return nhanVien;
}

// Thêm Nhân Viên
let formQLNV = document.getElementById("formQLNV");
console.log(formQLNV);
formQLNV.onsubmit = function (event) {
  event.preventDefault();
  let nhanVien = getValueNhanVien();
  if (!nhanVien) {
    return;
  }
  arrNhanVien.push(nhanVien);
  saveLocalStorage();

  renderArrNhanVien();
  hienThiThongBao("Thêm Nhân Viên thành công", 3000, "bg-success");
  console.log(nhanVien);
  formQLNV.reset();
};

// Hiển thị dữ liệu trong mảng lên giao diện
function renderArrNhanVien(arr = arrNhanVien) {
  let content = "";
  for (let nhanVien of arr) {
    let newNhanVien = new NhanVien();
    Object.assign(newNhanVien, nhanVien);

    // destructuring
    let { tknv, name, email, datepicker, chucvu } = newNhanVien;
    let tinhTongLuong = newNhanVien.tinhTongLuong();
    let xepLoai = newNhanVien.xepLoai();

    content += `
    <tr>
      <td>${tknv}</td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${datepicker}</td>
      <td>${
        chucvu === "Sep"
          ? "<span class='badge bg-danger'>Sếp</span>"
          : chucvu === "truongPhong"
          ? "<span class='badge bg-warning'>Trưởng Phòng</span>"
          : "<span class='badge bg-success'>Nhân Viên</span>"
      }
      </td>

      <td>${tinhTongLuong}</td>
      <td>${xepLoai}</td>
      <td>
        <button onclick="deleteNhanVien('${tknv}')" class="btn btn-danger">Xoá</button>
        <button onclick="getInfoNhanVien('${tknv}')" class="btn btn-warning" data-toggle="modal" data-target="#myModal">Sửa</button>
      </td>
    </tr>
    `;
  }
  document.getElementById("tableDanhSach").innerHTML = content;
}

// Thực hiện lưu trữ localStorage
function saveLocalStorage(key = "arrNhanVien", value = arrNhanVien) {
  let stringJson = JSON.stringify(value);
  localStorage.setItem(key, stringJson);
}

// Thực hiện lấy dữ liệu từ localStorage
function getLocalStorage(key = "arrNhanVien") {
  // lấy dữ liệu từ localStorage lên
  let dataLocal = localStorage.getItem(key);
  // convert từ chuỗi JSON về object
  let newDataLocal = JSON.parse(dataLocal);
  console.log(newDataLocal);
  return newDataLocal ? newDataLocal : [];
}

// Lấy thông tin Nhân viên
function getInfoNhanVien(tknv) {
  console.log(tknv);
  // let nhanVien ==> find
  // đưa dữ liệu lên các input của form
  let nhanVien = arrNhanVien.find((item, index) => {
    return item.tknv == tknv;
  });
  if (nhanVien) {
    // thao tác đưa dữ liệu lên giao diện
    let arrField = document.querySelectorAll(
      "#formQLNV input, #formQLNV select"
    );
    for (let item of arrField) {
      let { id } = item; // tknv
      item.value = nhanVien[id];
      if (id == "tknv") {
        item.readOnly = true;
      }
    }
  }
}

// deleteNhanVien
function deleteNhanVien(tknv) {
  // findIndex ==> index ==> -1
  // find ==> item ==> undefined
  console.log("sk delete");
  console.log(tknv);
  // tìm kiếm vị trí index của phần tử cần xoá
  let index = arrNhanVien.findIndex((item, index) => {
    // ==> Object
    return item.tknv == tknv;
  });
  if (index != -1) {
    arrNhanVien.splice(index, 1);
    renderArrNhanVien();
    saveLocalStorage();
    hienThiThongBao("Xoá Nhân viên thành công", 3000, "bg-danger");
  }
  console.log(arrNhanVien);
  // sử dụng hàm splice để xoá phần tử khỏi mảng
}

// cập nhật nhân viên
function updateNhanVien() {
  // thực hiện xử lí lấy dữ liệu từ form
  let nhanVien = getValueNhanVien();
  if (!nhanVien) {
    return;
  }
  // tìm kiếm vị trí của phần tử đang cần chỉnh sửa trong mảng ==> findIndex
  let index = arrNhanVien.findIndex((item, index) => {
    return item.tknv == nhanVien.tknv;
  });
  console.log("log index", index);
  if (index != -1) {
    arrNhanVien[index] = nhanVien;
  }
  renderArrNhanVien();
  saveLocalStorage();
  formQLNV.reset();
  document.getElementById("tknv").readOnly = false;
  hienThiThongBao("Cập nhật Nhân Viên thành công", 3000, "bg-success");

  // cho phép input mkh được thực hiện nhập dữ liệu readOnly
  console.log("log nhan vien", nhanVien);
}

document.getElementById("btnCapNhat").onclick = updateNhanVien;

// Tìm kiếm Nhân Viên
document.getElementById("searchName").oninput = function (event) {
  console.log("bắt sk oninput");
  let newKeyword = removeVietnameseTones(event.target.value)
    .trim()
    .toLowerCase();

  // Chuyển đổi các đối tượng trong arrNhanVien thành các thể hiện của lớp NhanVien
  let arrFilter = arrNhanVien
    .map((item) => {
      let nhanVien = new NhanVien();
      Object.assign(nhanVien, item); // Sao chép các thuộc tính từ item vào nhanVien
      return nhanVien;
    })
    .filter((nhanVien) => {
      let newXepLoai = removeVietnameseTones(nhanVien.xepLoai())
        .trim()
        .toLowerCase();
      return newXepLoai.includes(newKeyword);
    });

  renderArrNhanVien(arrFilter);
};

//===
function hienThiThongBao(text, duration, className) {
  Toastify({
    text,
    className,
    duration,
    // destination: "https://github.com/apvarun/toastify-js",
    // newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    // style: {
    //   // background: "linear-gradient(to right, #00b09b, #96c93d)",
    //   background: "red",
    // },
    backgroundColor: "orange",
  }).showToast();
}
