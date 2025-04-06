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

// Show the result section when calculation is complete
function showResult() {
    document.getElementById('result').classList.add('visible');
}

function calculateHeight() {
    // Hide any previous results until new calculation is done
    document.getElementById('result').classList.remove('visible');
    // 1. Get Input Values
    const ageInMonths = parseInt(document.getElementById('age_months').value);
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

    // 3. Validate Inputs (updated for height)
    if (isNaN(ageInMonths) || ageInMonths < 160 || ageInMonths > 164) {
        document.getElementById('predictedHeight').textContent = "Please select a valid age option.";
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

    // Update this part of the calculateHeight function:

    // --- Visualization Logic ---
    // Improved visualization logic that aligns images at the feet level
    const wembanyamaHeightCm = 223.52; // Victor Wembanyama's height in cm
    const heightRatio = predictedHeightCm / wembanyamaHeightCm;

    const wembanyamaImage = document.getElementById('wembanyama-image');
    const predictedHeightImage = document.getElementById('predicted-height-image');

    // Preload both images
    wembanyamaImage.src = "wemby.png";
    predictedHeightImage.src = "person.jpg"; 

    // Update the label to say "Your height" with a line break before the predicted height
    const predictedHeightLabel = document.getElementById('predicted-height-label');
    predictedHeightLabel.innerHTML = "Your predicted height:<br>" + predictedHeightOutput;

        // Make sure both images are loaded before applying height
    let imagesLoaded = 0;
    const onImageLoad = function() {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            // Both images loaded, now set heights
            const wembyNaturalHeight = wembanyamaImage.naturalHeight;
            console.log("Wembanyama image natural height: " + wembyNaturalHeight);
            console.log("Predicted height image natural height: " + predictedHeightImage.naturalHeight);
            console.log("heightRatio: " + heightRatio);

            const predictedImageHeight = Math.round(wembyNaturalHeight * heightRatio);
            
            // Set explicit height on images
            wembanyamaImage.style.height = wembyNaturalHeight + 'px';
            predictedHeightImage.style.height = predictedImageHeight + 'px';
            
            // Ensure the visualization container is tall enough
            document.getElementById('visualization-container').style.minHeight = 
                (Math.max(wembyNaturalHeight, predictedImageHeight) + 50) + 'px';
            
            // Show the result section
            showResult();
        }
    };

    // Set up load handlers for both images
    wembanyamaImage.onload = onImageLoad;
    predictedHeightImage.onload = onImageLoad;


    // Add error handling in case the image doesn't load
    wembanyamaImage.onerror = function() {
        console.error("Failed to load Wembanyama image");
        document.getElementById('predictedHeight').textContent = predictedHeightOutput;
        document.getElementById('predicted-height-label').textContent = predictedHeightOutput;
        showResult();
    };

    predictedHeightImage.onerror = function() {
        console.error("Failed to load comparison image");
        document.getElementById('predictedHeight').textContent = predictedHeightOutput;
        showResult();
    };
};
