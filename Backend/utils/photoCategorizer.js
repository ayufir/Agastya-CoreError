function categorizePhoto(filename) {
    const name = filename.toLowerCase();

    if (name.includes("front")) return "front";
    if (name.includes("left")) return "left";
    if (name.includes("right")) return "right";
    if (name.includes("back")) return "back";
    if (name.includes("inside")) return "interior";

    return "other";
}

module.exports = categorizePhoto;
