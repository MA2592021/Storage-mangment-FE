import axios from "axios";

function Create(DataToSend) {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/employee/`, DataToSend)
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

function GetById(Id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/employee/${Id}`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

function GetAll() {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/employee/`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

function GetByCode(Code) {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/employee/code/`, { code: Code })
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}
function GetSalary(id) {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/salary/employee/" + id)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

function Update(Id, DataToSend) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/employee/${Id}`, DataToSend)
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

function Delete(Id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/employee/${Id}`)
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

export { Create, GetById, GetAll, GetByCode, GetSalary, Update, Delete };
