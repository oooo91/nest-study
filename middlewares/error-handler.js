export const handleAddError = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "등록에 실패하였습니다." });
};

export const handleUpdateError = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "수정에 실패하였습니다." });
};

export const handleCommonError = (err, req, res, next) => {
  if (err.name == "ValidationError") {
    return res.status(400).json({ message: "빈 값이 존재합니다." });
  }
  console.log(err);
  res.status(500).json({ error: err });
};
