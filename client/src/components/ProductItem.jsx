import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="userRow">
      <div className="userMain">
        <div className="userId">#{product.id}</div>
        <div className="userName">{product.name}</div>
        <div className="userAge">{product.category} • {product.price} ₽ • в наличии: {product.quantity}</div>
        {product.description && <div className="userAge" style={{ opacity: 0.7, fontSize: "12px" }}>{product.description}</div>}
      </div>
      <div className="userActions">
        <button className="btn" onClick={() => onEdit(product)}>
          Редактировать
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}
