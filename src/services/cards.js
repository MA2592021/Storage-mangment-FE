//cards.js
import axios from "axios";

async function Create(
  CardCode,
  OrderId,
  ModelIndex,
  Quantity,
  StartRange,
  EndRange,
  CutNumber,
  BoxNumber
) {
  const res = await axios.post(`/api/card/`, {
    code: CardCode,
    order: OrderId,
    modelIndex: ModelIndex,
    quantity: Quantity,
    startRange: StartRange,
    endRange: EndRange,
    cutNumber: CutNumber,
    boxNumber: BoxNumber,
  });
  return res.msg;
}
async function Delete(CardId) {
  const res = await axios.delete(`/api/card/${CardId}`);
  return res.msg;
}
async function Update(CardId, DataToSend) {
  const res = await axios.patch(`/api/card/${CardId}`, DataToSend);
  return res.msg;
}
async function GetAll() {
  const res = await axios.get("/api/card");
  return res.data.data;
}
async function GetAllForOrderAndModel(OrderId, ModelId) {
  const res = await axios.get(
    `/api/card/order/${OrderId}/model/${ModelId}/codes`
  );
  return res.data.data;
}
async function GetLastNumber(number) {
  const res = await axios.get(`/api/card/last/${number}`);
  return res.data.data;
}
async function GetOne(id) {
  const res = await axios.get(`/api/card/${id}`);
  return res.data.data;
}
async function GetStagesNeedRepair(CardId) {
  const res = await axios.get(`/api/card/${CardId}/errors/repair`);
  return res.data.data;
}
async function GetWithOrderAndModel(OrderId, ModelId) {
  const res = await axios.get(`/api/card/order/${OrderId}/model/${ModelId}`);
  return res.data.data;
}
async function GetErrorsWithOrderAndModel(OrderId, ModelId) {
  const res = await axios.get(
    `/api/card/order/${OrderId}/model/${ModelId}/errors`
  );
  return res.data.data;
}
async function GetProductionFollowUp(OrderId, ModelId) {
  const res = await axios.get(
    `/api/card/order/${OrderId}/model/${ModelId}/production`
  );
  return res.data.data;
}
async function GetStageIsTracked(CardId, StageId) {
  const res = await axios.get(`/api/card/${CardId}/stage/${StageId}/isTracked`);
  return res.data.data;
}
async function GetByCodeAndModelAndOrder(CardCode, OrderId, ModelId) {
  const res = await axios.post(`/api/card/code/${CardCode}`, {
    model: ModelId,
    order: OrderId,
  });
  return res.data.data;
}
async function AddTracking(CardId, Employee, EnteredBy, StageId) {
  const res = await axios.patch(`/api/card/${CardId}/tracking/add`, {
    stage: StageId,
    employee: Employee,
    enteredby: EnteredBy,
  });
  return res.msg;
}
async function ReplaceTracking(CardId, Employee, EnteredBy, StageId) {
  const res = await axios.patch(`/api/card/${CardId}/tracking/replace`, {
    stage: StageId,
    employee: Employee,
    enteredby: EnteredBy,
  });
  return res.msg;
}
async function AddError(CardId, EnteredBy, CardErrors) {
  const res = await axios.patch(`/api/card/${CardId}/errors/add`, {
    cardErrors: CardErrors,
    employee: EnteredBy,
  });
  return res.msg;
}
async function RepairAll(CardId, EnteredBy, Repairs) {
  const res = await axios.patch(`/api/card/${CardId}/errors/repair/all`, {
    repairs: Repairs,
    enteredby: EnteredBy,
  });
  return res.msg;
}
async function ConfirmAll(CardId, VerifiedBy, Stages) {
  const res = await axios.patch(`/api/card/${CardId}/errors/confirm/all`, {
    stages: Stages,
    verifiedBy: VerifiedBy,
  });
  return res.msg;
}
async function AddGlobalError(CardId, Desc, PieceNo, AddedBy) {
  const res = await axios.patch(`/api/card/${CardId}/errors/global/add`, {
    description: Desc,
    addedBy: AddedBy,
    pieceNo: PieceNo,
  });
  return res.msg;
}
async function ConfirmGlobalError(CardId, GlobalErrorIndex, VerifyBy) {
  const res = await axios.patch(`/api/card/${CardId}/errors/global/confirm`, {
    globalErrorIndex: GlobalErrorIndex,
    verifyBy: VerifyBy,
  });
  return res.msg;
}
export {
  GetByCodeAndModelAndOrder,
  GetStageIsTracked,
  GetProductionFollowUp,
  GetErrorsWithOrderAndModel,
  GetWithOrderAndModel,
  GetStagesNeedRepair,
  GetOne,
  GetLastNumber,
  GetAllForOrderAndModel,
  GetAll,
  Create,
  Delete,
  Update,
  AddTracking,
  ReplaceTracking,
  AddError,
  RepairAll,
  ConfirmAll,
  AddGlobalError,
  ConfirmGlobalError,
};
