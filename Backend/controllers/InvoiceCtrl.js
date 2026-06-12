const Invoice = require("../model/InvoiceModel");

exports.saveInvoice = async (req, res) => {
  try {
    const { bankName, invoiceNo, invoiceDate, billMonth, totalAmount, rows, meta } = req.body;
    
    // Check if invoice number already exists
    const existing = await Invoice.findOne({ invoiceNo });
    if (existing) {
      return res.status(400).json({ success: false, message: "Invoice number already exists" });
    }

    const newInvoice = new Invoice({
      bankName,
      invoiceNo,
      invoiceDate: new Date(invoiceDate.split('.').reverse().join('-')), // Convert DD.MM.YYYY to Date
      billMonth,
      totalAmount,
      rows,
      meta
    });

    await newInvoice.save();
    res.status(201).json({ success: true, message: "Invoice saved successfully", data: newInvoice });
  } catch (error) {
    console.error("Save Invoice Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};





exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { bankName, invoiceNo, invoiceDate, billMonth, totalAmount, rows, meta } = req.body;

    // Convert DD.MM.YYYY to Date (same as save)
    const parsedDate = new Date(invoiceDate.split('.').reverse().join('-'));

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        bankName,
        invoiceNo,
        invoiceDate: parsedDate,
        billMonth,
        totalAmount,
        rows,
        meta
      },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    res.status(200).json({ success: true, message: "Invoice updated successfully", data: updatedInvoice });
  } catch (error) {
    console.error("Update Invoice Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};







exports.getAllInvoices = async (req, res) => {
  try {
    const { bank, month, year, status } = req.query;
    let query = {};
    
    if (bank && bank !== "All") {
      query.bankName = bank;
    }

    if (status && status !== "All") {
      query.status = status;
    }
    
    if (month && month !== "All") {
      // User wants data for the month BEFORE the one selected
      const selectedMonth = parseInt(month);
      const targetMonth = selectedMonth - 1; 
      const y = parseInt(year) || new Date().getFullYear();
      const startDate = new Date(y, targetMonth, 1);
      const endDate = new Date(y, targetMonth + 1, 0, 23, 59, 59);
      query.invoiceDate = { $gte: startDate, $lte: endDate };
    } else if (year && year !== "All") {
      const y = parseInt(year);
      const startDate = new Date(y, 0, 1);
      const endDate = new Date(y, 11, 31, 23, 59, 59);
      query.invoiceDate = { $gte: startDate, $lte: endDate };
    }

    const invoices = await Invoice.find(query).sort({ invoiceDate: -1 });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    console.error("Get Invoices Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
