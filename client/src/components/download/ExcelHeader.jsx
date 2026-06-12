import React from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { Layout, Typography, Divider } from "antd";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ExcelHeader = () => {
  // Explicit color definitions in supported formats
  const colors = {
    background: "#f8fafc", // slate-50
    primaryDark: "#1e40af", // blue-800
    primary: "#2563eb", // blue-600
    textDark: "#1f2937", // gray-800
    textMedium: "#4b5563", // gray-600
    border: "#e5e7eb", // gray-200
    contactBg: "#eff6ff", // blue-50
  };

  return (
    <div
      className='border rounded'
      style={{
        width: "100%",
        backgroundColor: colors.background,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <header
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "8px 16px",
          backgroundColor: "transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo and Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <img
              src='/assets/images/download.png'
              alt='Unique Engineering Logo'
              style={{
                width: "96px",
                height: "auto",
                objectFit: "contain",
              }}
            />
            <div>
              <h3
                style={{
                  margin: 0,
                  color: colors.primaryDark,
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: 1.2,
                }}
              >
                UNIQUE ENGINEERING AND ASSOCIATE
              </h3>
              <p
                style={{
                  color: colors.textMedium,
                  fontSize: "12px",
                  margin: 0,
                }}
              >
                Professional Valuation Services
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div>
              <p
                style={{
                  color: colors.primaryDark,
                  fontWeight: 600,
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                CHARTED ENGINEER AND APPROVED VALUER
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0 16px",
                }}
              >
                <span style={{ color: colors.textMedium, fontSize: "12px" }}>
                  Reg. AMIE- AM167147-5
                </span>
                <span style={{ color: colors.textMedium, fontSize: "12px" }}>
                  IMC- 82-16
                </span>
                <span style={{ color: colors.textMedium, fontSize: "12px" }}>
                  IIOV- CAT-I/A-4537
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <a
                href='http://www.ueaa.co.in'
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: colors.primary,
                  fontSize: "12px",
                  textDecoration: "none",
                }}
              >
                <Globe
                  style={{ width: "12px", height: "12px", marginRight: "4px" }}
                />
                www.ueaa.co.in
              </a>
              <a
                href='mailto:bhartsharma1@gmail.com'
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: colors.primary,
                  fontSize: "12px",
                  textDecoration: "none",
                }}
              >
                <Mail
                  style={{ width: "12px", height: "12px", marginRight: "4px" }}
                />
                bhartsharma1@gmail.com
              </a>
            </div>

            <div style={{ display: "none" }}>
              <p
                style={{
                  color: colors.textDark,
                  fontWeight: 500,
                  fontSize: "12px",
                  margin: 0,
                }}
              >
                CONSULTING ENGINEER VALUERS, ARCHITECTS AND DESIGNER WORK,
              </p>
              <p
                style={{
                  color: colors.textDark,
                  fontWeight: 500,
                  fontSize: "12px",
                  margin: 0,
                }}
              >
                REGISTERED ENGINEER WITH IMC AND T&CP
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          backgroundColor: colors.border,
          margin: "8px 0",
        }}
      ></div>

      {/* Address */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "8px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <p
          style={{
            color: colors.textDark,
            fontSize: "12px",
            textAlign: "center",
            margin: 0,
          }}
        >
          REG. OFFICE - OFFICE NO. 102, SWADESH BHAWAN PLOT NO. 2 PRESS COMPLEX
          A.B ROAD INDORE. 452001 M.P
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: colors.contactBg,
            padding: "4px 12px",
            borderRadius: "9999px",
          }}
        >
          <Phone
            style={{ color: colors.primary, width: "16px", height: "16px" }}
          />
          <div>
            <p
              style={{
                fontWeight: 600,
                color: colors.primaryDark,
                fontSize: "12px",
                margin: 0,
              }}
            >
              BHART SHARMA
            </p>
            <p
              style={{
                color: colors.primary,
                fontSize: "12px",
                margin: 0,
              }}
            >
              +919993970499
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelHeader;
