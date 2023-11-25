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
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/card/`, {
        code: CardCode,
        order: OrderId,
        modelIndex: ModelIndex,
        quantity: Quantity,
        startRange: StartRange,
        endRange: EndRange,
        cutNumber: CutNumber,
        boxNumber: BoxNumber,
      })
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function Delete(CardId) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/card/${CardId}`)
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function Update(CardId, DataToSend) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/card/${CardId}`, DataToSend)
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function GetAll() {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/card")
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}
async function GetAllForOrderAndModel(OrderId, ModelId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/order/${OrderId}/model/${ModelId}`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

async function GetLastNumber(number) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/last/${number}`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

async function GetOne(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/${id}`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

async function GetStagesNeedRepair(CardId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/${CardId}/errors/repair`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

async function GetWithOrderAndModel(OrderId, ModelId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/order/${OrderId}/model/${ModelId}`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

async function GetErrorsWithOrderAndModel(OrderId, ModelId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/order/${OrderId}/model/${ModelId}/errors`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

async function GetProductionFollowUp(OrderId, ModelId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/order/${OrderId}/model/${ModelId}/production`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}
async function GetStats(OrderId, ModelId, Date) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/order/${OrderId}/model/${ModelId}/date/${Date}`)
      .then((res) => resolve(res.data.result))
      .catch((err) => reject(err));
  });
}
async function GetDateBounds(OrderId, ModelId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/order/${OrderId}/model/${ModelId}/dateBounds`)
      .then((res) => resolve(res.data.result))
      .catch((err) => reject(err));
  });
}
async function GetStageIsTracked(CardId, StageId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/card/${CardId}/stage/${StageId}/isTracked`)
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

async function GetByCodeAndModelAndOrder(CardCode, OrderId, ModelId) {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/card/code/${CardCode}`, {
        model: ModelId,
        order: OrderId,
      })
      .then((res) => resolve(res.data.data))
      .catch((err) => reject(err));
  });
}

async function AddTracking(CardId, Employee, EnteredBy, StageId) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/card/${CardId}/tracking/add`, {
        stage: StageId,
        employee: Employee,
        enteredby: EnteredBy,
      })
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function ReplaceTracking(CardId, Employee, EnteredBy, StageId) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/card/${CardId}/tracking/replace`, {
        stage: StageId,
        employee: Employee,
        enteredby: EnteredBy,
      })
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function AddError(CardId, EnteredBy, CardErrors) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/card/${CardId}/errors/add`, {
        cardErrors: CardErrors,
        employee: EnteredBy,
      })
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function RepairAll(CardId, EnteredBy, Repairs) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/card/${CardId}/errors/repair/all`, {
        repairs: Repairs,
        enteredby: EnteredBy,
      })
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function ConfirmAll(CardId, VerifiedBy, Stages) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/card/${CardId}/errors/confirm/all`, {
        stages: Stages,
        verifiedBy: VerifiedBy,
      })
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function AddGlobalError(CardId, Desc, PieceNo, AddedBy) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/card/${CardId}/errors/global/add`, {
        description: Desc,
        addedBy: AddedBy,
        pieceNo: PieceNo,
      })
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
}

async function ConfirmGlobalError(CardId, GlobalErrorIndex, VerifyBy) {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/card/${CardId}/errors/global/confirm`, {
        globalErrorIndex: GlobalErrorIndex,
        verifyBy: VerifyBy,
      })
      .then((res) => resolve(res.data.msg))
      .catch((err) => reject(err));
  });
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
  GetStats,
  GetDateBounds,
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
