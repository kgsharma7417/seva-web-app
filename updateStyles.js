const fs = require('fs');

const filesToUpdate = [
    'src/pages/ServiceListing.jsx',
    'src/pages/UserDashboard.jsx',
    'src/pages/WorkerDashboard.jsx',
    'src/pages/AdminDashboard.jsx',
    'src/pages/ReviewForm.jsx'
];

const replacements = [
    [/bg-white dark:bg-white\/5 border border-gray-200 dark:border-white\/10/g, 'glass-card'],
    [/bg-gray-50 dark:bg-white\/5 border border-gray-200 dark:border-white\/10/g, 'glass-card'],
    [/bg-white dark:glass-card border border-gray-200 dark:border-transparent/g, 'glass-card'],
    [/bg-white dark:bg-white\/5 border-gray-200 dark:border-white\/10/g, 'glass-card'],
    [/bg-white border border-gray-200 dark:glass-card dark:bg-\[\#0A132D\] dark:border-\[\#3B82F6\]\/30/g, 'glass-card'],
    [/bg-white border border-gray-200 dark:glass-card/g, 'glass-card'],
    [/bg-white dark:bg-\[\#0A132D\] text-gray-900 dark:text-white border border-gray-200 dark:border-white\/10/g, 'glass-card text-gray-900 dark:text-white'],
    [/bg-white dark:glass-card/g, 'glass-card'],
    [/bg-gray-50 border border-gray-200 dark:border-white\/5 dark:glass-card/g, 'glass-card'],
    [/bg-gray-50 dark:bg-white\/5 border border-gray-200 dark:border-transparent/g, 'glass-card'],
    [/bg-gray-50 border border-gray-200 dark:glass-card dark:border-transparent/g, 'glass-card'],
    
    // Shadows
    [/ shadow-sm dark:shadow-none/g, ''],
    [/ shadow-sm dark:shadow-lg/g, ' shadow-lg'],
    [/ shadow-sm/g, '']
];

filesToUpdate.forEach(filepath => {
    if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf8');
        
        replacements.forEach(([old, newVal]) => {
            content = content.replace(old, newVal);
        });
        
        // specifically fix ServiceListing weird buttons
        content = content.replace(/bg-\[\#3B82F6\]\/10 dark:bg-\[\#3B82F6\]\/20 border-\[\#3B82F6\] text-\[\#3B82F6\] dark:text-white/g, "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25 border-transparent");
        content = content.replace(/bg-white dark:bg-white\/5 border-gray-200 dark:border-white\/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white\/10/g, "glass-card text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10");
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    }
});
