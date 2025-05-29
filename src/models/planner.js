import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PlannerEvent = sequelize.define(
  "PlannerEvent",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    coupleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "coupleId", // corresponde ao nome exato da coluna no banc
    },
    nomeEvento: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "nomeEvento",
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "descricao",
    },
    dataEvento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "dataEvento",
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: true,
      field: "horaInicio",
    },
    horaTermino: {
      type: DataTypes.TIME,
      allowNull: true,
      field: "horaTermino",
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "categoria",
    },
    criadoEm: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "criadoEm",
    },
  },
  {
    tableName: "planner_events",
    timestamps: false,
  }
);

export default PlannerEvent;
