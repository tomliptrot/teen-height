function toggleHeightInputs() {
    const unit = document.getElementById('height_unit').value;
    if (unit === 'cm') {
        document.getElementById('cm_input').style.display = 'block';
        document.getElementById('ftin_input').style.display = 'none';
    } else {
        document.getElementById('cm_input').style.display = 'none';
        document.getElementById('ftin_input').style.display = 'block';
    }
}

function calculateHeight() {
    // 1. Get Input Values
    const dob = new Date(document.getElementById('dob').value);
    const pubertyStage = parseInt(document.getElementById('puberty').value);
    const heightUnit = document.getElementById('height_unit').value;
    let currentHeightCm;

    if (heightUnit === 'cm') {
        currentHeightCm = parseFloat(document.getElementById('height_cm').value);
    } else {
        const feet = parseInt(document.getElementById('height_ft').value) || 0;
        const inches = parseFloat(document.getElementById('height_in').value) || 0;
        currentHeightCm = (feet * 12 + inches) * 2.54;
    }
    // 2. Calculate Age in Months
    const today = new Date();
    let ageInMonths = (today.getFullYear() - dob.getFullYear()) * 12;
    ageInMonths += today.getMonth() - dob.getMonth();
    //Correct for full months
    if (today.getDate() < dob.getDate()){
        ageInMonths -= 1
    }

    // 3. Validate Inputs (updated for height)
    if (isNaN(ageInMonths) || ageInMonths < 160 || ageInMonths > 164) {
        document.getElementById('predictedHeight').textContent = "Age must be between 160 and 164 months (13 years and 4 months to 13 years and 8 months).";
        return;
    }

    if (isNaN(pubertyStage) || pubertyStage < 1 || pubertyStage > 3) {
        document.getElementById('predictedHeight').textContent = "Please select a valid pubertal stage (ST1, ST2, or ST3).";
        return;
    }

    if (isNaN(currentHeightCm) || currentHeightCm <= 0) {
        document.getElementById('predictedHeight').textContent = "Please enter a valid height.";
        return;
    }
     // 4. Lookup Mean Stature (Table 4 from the paper)
     let meanStature;
    let standardDeviation = 6;
    if (ageInMonths === 160) {
        if (pubertyStage === 1) meanStature = 151.5;
        else if (pubertyStage === 2) meanStature = 159.3;
        else meanStature = 165.3;
    } else if (ageInMonths === 161) {
        if (pubertyStage === 1) meanStature = 152.1;
        else if (pubertyStage === 2) meanStature = 159.9;
        else meanStature = 165.8;
    } else if (ageInMonths === 162) {
        if (pubertyStage === 1) meanStature = 152.7;
        else if (pubertyStage === 2) meanStature = 160.5;
        else meanStature = 166.3;
    } else if (ageInMonths === 163) {
        if (pubertyStage === 1) meanStature = 153.4;
        else if (pubertyStage === 2) meanStature = 161.1;
        else meanStature = 166.8;
    } else if (ageInMonths === 164) {
        if (pubertyStage === 1) meanStature = 154.0;
        else if (pubertyStage === 2) meanStature = 161.7;
        else meanStature = 167.3;
    }

    // 5. Calculate Z-score
    const zScore = (currentHeightCm - meanStature) / standardDeviation;

    // 6. Calculate Predicted Adult Height (at 216 months) in cm
    let predictedHeightCm = 177 + (zScore * standardDeviation);

    // 7. Convert to Output Unit and Display
    let predictedHeightOutput;
    if (heightUnit === 'cm') {
        predictedHeightOutput = predictedHeightCm.toFixed(1) + " cm";
    } else {
        // Convert cm to feet and inches
        const totalInches = predictedHeightCm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = (totalInches % 12).toFixed(1);
        predictedHeightOutput = feet + " ft " + inches + " in";
    }

    document.getElementById('predictedHeight').textContent = predictedHeightOutput;
     // --- Visualization Logic ---
     const wembanyamaHeightCm = 223.52; // Victor Wembanyama's height in cm
    const heightRatio = predictedHeightCm / wembanyamaHeightCm;

    const wembanyamaImage = document.getElementById('wembanyama-image');
    wembanyamaImage.src = "wemby.png";

    wembanyamaImage.onload = () => {
        const predictedHeightImage = document.getElementById('predicted-height-image');
        predictedHeightImage.src = "person.jpg"; // Set the source for the second image

        const wembyImageHeight = wembanyamaImage.clientHeight;
        
        // Set the height of the *second image*
        predictedHeightImage.style.height = (wembyImageHeight * heightRatio) + "px";
        console.log(predictedHeightImage.style.height);
        // Update the label for the predicted height bar
        document.getElementById('predicted-height-label').textContent = predictedHeightOutput;
        }

}