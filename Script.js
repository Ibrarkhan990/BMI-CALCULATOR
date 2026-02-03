// Current state
let currentStep = 0;
const totalSteps = 4;

// On Load
document.addEventListener("DOMContentLoaded", function() {
    showStep(0);
});

// Navigation Logic
function showStep(index) {
    // Hide all steps
    const sections = document.querySelectorAll('.step-section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // Show target step
    const target = document.getElementById(`step-${index}`);
    if(target) {
        target.style.display = 'block';
        target.classList.add('active');
    }

    currentStep = index;
    updateProgress(index);
}

function nextStep() {
    if(currentStep < totalSteps) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if(currentStep > 0) {
        showStep(currentStep - 1);
    }
}

function updateProgress(stepIndex) {
    const progressFill = document.getElementById('progressBarFill');
    const lblStep = document.getElementById('lblStep');
    const progressContainer = document.getElementById('progressContainer');

    // Steps are 0-based index, display uses 1-based
    let displayStep = stepIndex + 1;
    
    // Calculate percentage (Step 1=25%, 2=50%, etc)
    let width = displayStep * 25;
    progressFill.style.width = width + "%";
    lblStep.innerText = `Step ${displayStep} of 4`;

    // Hide progress on Result page (Index 4)
    if (stepIndex === 4) {
        progressContainer.style.display = 'none';
    } else {
        progressContainer.style.display = 'block';
    }
}

// Logic: Gender Selection
function selectGender(gender) {
    document.getElementById('hfGender').value = gender;
    
    // Visual feedback for gender card
    const cards = document.querySelectorAll('.gender-card');
    cards.forEach(card => card.classList.remove('selected'));
    // Find the button clicked and add class (simplified approach)
    event.currentTarget.classList.add('selected');

    // Auto move next
    setTimeout(() => {
        nextStep();
    }, 300);
}

// Logic: Toggle Height Units
function toggleHeightUnit() {
    const isCm = document.getElementById('rbCm').checked;
    const pnlCm = document.getElementById('pnlCm');
    const pnlFt = document.getElementById('pnlFt');

    if(isCm) {
        pnlCm.style.display = 'block';
        pnlFt.style.display = 'none';
    } else {
        pnlCm.style.display = 'none';
        pnlFt.style.display = 'block';
    }
}

// Logic: Calculate BMI (Replicated from C#)
function calculateBMI() {
    let weightKg = 0;
    let heightM = 0;
    let isValid = true;

    // 1. Get Height
    const isCm = document.getElementById('rbCm').checked;
    if(isCm) {
        const val = parseFloat(document.getElementById('txtHeightCm').value);
        if(!isNaN(val) && val > 0) {
            heightM = val / 100.0;
        } else { isValid = false; }
    } else {
        const ft = parseFloat(document.getElementById('txtFt').value) || 0;
        const inch = parseFloat(document.getElementById('txtIn').value) || 0;
        if(ft > 0 || inch > 0) {
            const totalInches = (ft * 12) + inch;
            heightM = totalInches * 0.0254; 
        } else { isValid = false; }
    }

    // 2. Get Weight
    const isKg = document.getElementById('rbKg').checked;
    const weightVal = parseFloat(document.getElementById('txtWeight').value);
    
    if(!isNaN(weightVal) && weightVal > 0) {
        if(isKg) {
            weightKg = weightVal;
        } else {
            // Convert Lbs to Kg
            weightKg = weightVal * 0.453592;
        }
    } else { isValid = false; }

    if(!isValid) {
        alert("Please enter valid height and weight values.");
        return;
    }

    // 3. Calculation
    const bmi = weightKg / (heightM * heightM);
    const minWeight = 18.5 * (heightM * heightM);
    const maxWeight = 24.9 * (heightM * heightM);

    displayResults(bmi, weightKg, minWeight, maxWeight);
    showStep(4); // Show result view
}

// Logic: Display Results
function displayResults(bmi, currentWeight, minWeight, maxWeight) {
    const lblScore = document.getElementById('lblBmiScore');
    const lblCategory = document.getElementById('lblBmiCategory');
    const scoreCircle = document.querySelector('.score-circle');
    const litRecommendation = document.getElementById('litRecommendation');

    lblScore.innerText = bmi.toFixed(1);

    let category = "";
    let color = "";
    let recommendation = "";

    // C# Logic translation
    if (bmi < 18.5) {
        category = "Underweight";
        color = "#3498db"; // Blue
        let gainNeeded = minWeight - currentWeight;
        recommendation = `You are underweight. To reach a normal healthy weight, you should <b>gain at least ${gainNeeded.toFixed(1)} kg</b>. Aim for a target weight between ${minWeight.toFixed(1)} kg and ${maxWeight.toFixed(1)} kg.`;
    } 
    else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal Weight";
        color = "#2ecc71"; // Green
        recommendation = `Great job! Your weight is perfect. Keep maintaining your weight between ${minWeight.toFixed(1)} kg and ${maxWeight.toFixed(1)} kg.`;
    } 
    else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        color = "#f1c40f"; // Yellow
        let loseNeeded = currentWeight - maxWeight;
        recommendation = `You are slightly overweight. To reach a normal BMI, try to <b>lose about ${loseNeeded.toFixed(1)} kg</b>. Your target healthy weight is between ${minWeight.toFixed(1)} kg and ${maxWeight.toFixed(1)} kg.`;
    } 
    else {
        category = "Obese";
        color = "#e74c3c"; // Red
        let loseNeeded = currentWeight - maxWeight;
        recommendation = `Your BMI indicates obesity. For better health, it is recommended to <b>lose approximately ${loseNeeded.toFixed(1)} kg</b>. Aim for a healthy weight range of ${minWeight.toFixed(1)} kg - ${maxWeight.toFixed(1)} kg.`;
    }

    // Update UI
    lblCategory.innerText = category;
    lblCategory.style.backgroundColor = color;
    lblCategory.style.color = "#fff";
    scoreCircle.style.borderColor = color;
    litRecommendation.innerHTML = recommendation;
}

// Restart
function restartCalculator() {
    // Clear inputs
    document.getElementById('txtAge').value = '';
    document.getElementById('txtHeightCm').value = '';
    document.getElementById('txtFt').value = '';
    document.getElementById('txtIn').value = '';
    document.getElementById('txtWeight').value = '';
    
    showStep(0);
}