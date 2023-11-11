//employees.js

import axios from "axios";

async function Create(DataToSend) {
  const res = await axios.post(`/api/employee/`, DataToSend);
  return res.msg;
}
async function GetById(Id) {
  const res = await axios.get(`/api/employee/${Id}`);
  return res.data.data;
}
async function GetAll() {
  const res = await axios.get(`/api/employee/`);
  return res.data.data;
}
async function GetByCode(Code) {
  const res = await axios.post(`/api/employee/code/`, { code: Code });
  return res.data.data;
}
async function Update(Id, DataToSend) {
  const res = await axios.patch(`/api/employee/${Id}`, DataToSend);
  return res.msg;
}
async function Delete(Id) {
  const res = await axios.delete(`/api/employee/${Id}`);
  return res.msg;
}
export { Create, GetById, GetAll, GetByCode, Update, Delete };
