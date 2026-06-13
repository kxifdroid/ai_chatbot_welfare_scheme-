const fs = require('fs');
const path = require('path');

// Load the schemes data
const schemesFilePath = path.join(__dirname, 'schemes', 'schemes.json');
const allSchemes = JSON.parse(fs.readFileSync(schemesFilePath, 'utf8'));

/**
 * Filters schemes based on user profile and eligibility criteria.
 * @param {Object} userProfile - User data (occupation, gender, hasLand, incomeLakh, etc.)
 * @param {Array} schemesArray - Array of scheme objects to filter.
 * @returns {Array} - List of schemes where the user meets all criteria.
 */
function getEligibleSchemes(userProfile, schemesArray = allSchemes) {
    return schemesArray.filter(scheme => {
        const elig = scheme.eligibility;

        // Occupation check: match specific or "any"
        if (elig.occupation !== 'any' && userProfile.occupation !== elig.occupation) return false;

        // Gender check: match specific or "any"
        if (elig.gender !== 'any' && userProfile.gender !== elig.gender) return false;

        // Land ownership check: 'yes' requires hasLand=true, 'no' requires hasLand=false, 'any' matches all
        if (elig.land_ownership === 'yes' && !userProfile.hasLand) return false;
        if (elig.land_ownership === 'no' && userProfile.hasLand) return false;

        // Income check: must be less than or equal to max_income_lakh (if defined)
        if (elig.max_income_lakh !== null && userProfile.incomeLakh > elig.max_income_lakh) return false;

        // Boolean checks: must match exactly if not null
        if (elig.has_girl_child !== null && userProfile.hasGirlChild !== elig.has_girl_child) return false;
        if (elig.is_pregnant !== null && userProfile.isPregnant !== elig.is_pregnant) return false;
        if (elig.bpl_card !== null && userProfile.hasBPLCard !== elig.bpl_card) return false;

        return true;
    });
}

/**
 * Builds a structured text context from eligible schemes for the LLM.
 * @param {Array} eligibleSchemes - Array of scheme objects.
 * @param {string} languageCode - Language code (en, hi, bn, ta, mr).
 * @returns {string} - Formatted context string.
 */
function buildRAGContext(eligibleSchemes, languageCode) {
    if (!eligibleSchemes || eligibleSchemes.length === 0) {
        return "No eligible schemes found for this profile.";
    }

    return eligibleSchemes.map(scheme => {
        const name = scheme[`name_${languageCode}`] || scheme.name_en;
        const docs = scheme[`documents_${languageCode}`] || scheme.documents;
        const summary = scheme.summary_en; // Currently English only summaries in schema

        return `
---
Scheme Name: ${name}
Summary: ${summary}
Required Documents: ${docs.join(', ')}
Apply Online: ${scheme.apply_url}
Helpline: ${scheme.helpline_number}
---`;
    }).join('\n');
}

/**
 * Generates a numbered document checklist for a specific scheme.
 * @param {string} schemeIdOrName - The ID or English name of the scheme.
 * @param {string} languageCode - Target language for the checklist.
 * @param {Array} schemesArray - Array of scheme objects.
 * @returns {string} - Numbered checklist string.
 */
function generateDocumentChecklist(schemeIdOrName, languageCode, schemesArray = allSchemes) {
    const scheme = schemesArray.find(s => 
        s.id === schemeIdOrName || s.name_en.toLowerCase() === schemeIdOrName.toLowerCase()
    );

    if (!scheme) return "Scheme not found.";

    const docs = scheme[`documents_${languageCode}`] || scheme.documents;
    const name = scheme[`name_${languageCode}`] || scheme.name_en;

    let checklist = `📋 **Document Checklist for ${name}**:\n`;
    docs.forEach((doc, index) => {
        checklist += `${index + 1}. ${doc}\n`;
    });

    return checklist;
}

module.exports = {
    getEligibleSchemes,
    buildRAGContext,
    generateDocumentChecklist,
    allSchemes
};
