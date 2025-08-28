import pool from "../config/db.js";

export class User {
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `INSERT INTO users 
          (name, lastname, email, password, is_verified, role, image, is_google_user, reset_password_token, reset_password_expire) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.name ?? null,
          userData.lastname ?? null,
          userData.email?.toLowerCase() ?? null,
          userData.password ?? null,
          userData.isVerified ?? false,
          userData.role ?? "user",
          userData.image ?? null,
          userData.isGoogleUser ?? false,
          userData.resetPasswordToken ?? null,
          userData.resetPasswordExpire ?? null
        ]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase()]
    );
    return rows[0] || null;
  }

  static async findAll() {
    const [rows] = await pool.execute("SELECT * FROM users");
    return rows;
  }

  static async update(id, userData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const fields = [];
      const values = [];

      // Génération dynamique avec null-safety
      const safePush = (field, value) => {
        if (value !== undefined) {
          fields.push(`${field} = ?`);
          values.push(value ?? null);
        }
      };

      safePush("name", userData.name);
      safePush("lastname", userData.lastname);
      safePush("email", userData.email?.toLowerCase());
      safePush("password", userData.password);
      safePush("is_verified", userData.isVerified);
      safePush("role", userData.role);
      safePush("image", userData.image);
      safePush("is_google_user", userData.isGoogleUser);
      safePush("reset_password_token", userData.resetPasswordToken);
      safePush("reset_password_expire", userData.resetPasswordExpire);

      if (fields.length === 0) {
        throw new Error("No fields to update");
      }

      values.push(id);
      const query = `UPDATE users SET ${fields.join(
        ", "
      )}, updated_at = NOW() WHERE id = ?`;

      const [result] = await connection.execute(query, values);
      await connection.commit();

      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
  }

  static validateUserData(userData) {
    if (!userData.isGoogleUser) {
      if (!userData.lastname) {
        throw new Error("Lastname is required for non-Google users");
      }
      if (!userData.password) {
        throw new Error("Password is required for non-Google users");
      }
    }
    return true;
  }

  static async findByResetToken(token) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expire > NOW()",
      [token]
    );
    return rows[0] || null;
  }

  static async verifyEmail(id) {
    const [result] = await pool.execute(
      "UPDATE users SET is_verified = true WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }

  static async updatePassword(id, hashedPassword) {
    const [result] = await pool.execute(
      "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?",
      [hashedPassword, id]
    );
    return result.affectedRows;
  }
}

export default User;
