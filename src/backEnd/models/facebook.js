const facebook = (sequelize, DataTypes) => {
  const Facebook = sequelize.define(
    "Facebook",
    {
      title: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
      },
      imgUrl: {
        type: DataTypes.STRING(1000),
        validate: {
          len: {
            args: [0, 1000],
            msg: "0-1000!",
          },
        },
      },
      link: {
        type: DataTypes.STRING(1000),
        validate: {
          len: {
            args: [0, 1000],
            msg: "0-1000!",
          },
        },
      },
      category: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "facebook",
    }
  );

  return Facebook;
};

module.exports = facebook;
