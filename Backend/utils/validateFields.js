function validate(data) {
    if (data.saleAmount)
        data.saleAmount = data.saleAmount.replace(/[^\d]/g, "");

    return data;
}

module.exports = validate;
