import PDFDocument from "pdfkit";
import { ApplicationType } from "../model/applicationModel";
import { Client } from "../model/clientModel";

interface ClientTypes extends Client {}

export class PdfService {
  static async generateContractPDF(
    clientData: ClientTypes,
    application: ApplicationType,
    term?: string
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        // Collect the PDF into a buffer
        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });

        // Helper functions
        const addLine = (y: number) => {
          doc.moveTo(50, y).lineTo(545, y).stroke();
        };

        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };

        // Header Section
        doc
          .fontSize(24)
          .font("Helvetica-Bold")
          .text("REAL ESTATE CONTRACT", { align: "center" })
          .moveDown(0.5);

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`Contract ID: ${application._id || "N/A"}`, { align: "center" })
          .text(`Date: ${formatDate(new Date().toISOString())}`, {
            align: "center",
          })
          .moveDown(2);

        addLine(doc.y);
        doc.moveDown(1);

        // Client Info
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text("CLIENT (BUYER):")
          .moveDown(0.5);
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `Name: ${clientData.firstName} ${clientData.middleName || ""} ${
              clientData.lastName
            }`
          )
          .text(`Email: ${clientData.email || "N/A"}`)
          .text(`Contact: ${clientData.contact || "N/A"}`)
          .text(`Address: ${clientData.address || "N/A"}`)
          .text(`Marital Status: ${clientData.Marital || "N/A"}`)
          .moveDown(1);

        // Property Info
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text("PROPERTY DETAILS")
          .moveDown(0.5);
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`Property Name: ${application.landName}`)
          .text(`Land ID: ${application.landId}`)
          .text(`Lot IDs: ${application.lotIds.join(", ")}`)
          .text(`Application Date: ${formatDate(application.appointmentDate)}`)
          .moveDown(1);

        addLine(doc.y);
        doc.moveDown(1);

        // Terms and Conditions
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text("TERMS AND CONDITIONS")
          .moveDown(0.5);
        doc.fontSize(10).font("Helvetica");

        const termsArr = [
          {
            title: "Payment Terms",
            content: `The payment term for this property is ${
              term || "as agreed upon by both parties"
            }.`,
          },
          {
            title: "Property Transfer",
            content:
              "The seller agrees to transfer the property title to the buyer upon full payment of the agreed purchase price and completion of all contractual obligations.",
          },
          {
            title: "Possession",
            content:
              "The buyer shall take possession of the property upon execution of this contract and payment of the initial deposit, unless otherwise specified.",
          },
          {
            title: "Warranties",
            content:
              "The seller warrants that the property is free from any liens, encumbrances, or legal disputes and has clear title to the property.",
          },
          {
            title: "Default",
            content:
              "In case of default by either party, the non-defaulting party shall have the right to terminate this agreement and seek appropriate legal remedies.",
          },
          {
            title: "Governing Law",
            content:
              "This contract shall be governed by and construed in accordance with the laws of the jurisdiction where the property is located.",
          },
        ];

        termsArr.forEach((termItem, i) => {
          doc
            .font("Helvetica-Bold")
            .text(`${i + 1}. ${termItem.title}`)
            .font("Helvetica")
            .text(termItem.content, { indent: 20 })
            .moveDown(0.5);
        });

        doc.moveDown(1);
        addLine(doc.y);
        doc.moveDown(1);

        // Signatures
        doc.fontSize(14).font("Helvetica-Bold").text("SIGNATURES").moveDown(1);
        const signatureY = doc.y;

        doc.fontSize(10).font("Helvetica");
        doc.text("CLIENT (BUYER):", 50, signatureY);
        doc
          .moveTo(50, signatureY + 50)
          .lineTo(250, signatureY + 50)
          .stroke();
        doc.text("Signature", 50, signatureY + 55);
        doc.text(
          `${clientData.firstName} ${clientData.lastName}`,
          50,
          signatureY + 70
        );
        doc.text("Date: _______________", 50, signatureY + 85);

        if (application.agentDealerId) {
          doc.text("SELLER/AGENT:", 320, signatureY);
          doc
            .moveTo(320, signatureY + 50)
            .lineTo(520, signatureY + 50)
            .stroke();
          doc.text("Signature", 320, signatureY + 55);
          doc.text("Authorized Representative", 320, signatureY + 70);
          doc.text("Date: _______________", 320, signatureY + 85);
        }

        doc
          .fontSize(8)
          .text(
            "This is a legally binding contract. Please read carefully before signing.",
            50,
            signatureY + 120,
            { align: "center", width: 495 }
          );

        // Finalize PDF
        doc.end();
      } catch (error) {
        console.error("Error generating PDF:", error);
        reject(error);
      }
    });
  }
}
