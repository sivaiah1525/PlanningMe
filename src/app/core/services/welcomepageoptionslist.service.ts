import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WelcomepageoptionslistService {

  managementPoints = [
    { category: 'Management', point: 'Increased Productivity' },
    { category: 'Management', point: 'Performance Optimization' },
    { category: 'Management', point: 'Improved decision-making' },
    { category: 'Management', point: 'More Efficient Project Management' },
    { category: 'Management', point: 'Enhancing Personal Efficiency' },
    { category: 'Planning', point: 'Improving Customer Satisfaction' },
    { category: 'Planning', point: 'Optimization of Business Processes' },
    { category: 'Planning', point: 'Improved Leads Management' },
    { category: 'Planning', point: 'Sales Increase' },
    { category: 'Planning', point: 'Cost Reduction' },
    { category: 'Discussion', point: 'Strategic Alignment' },
    { category: 'Discussion', point: 'Resource Optimization' },
    { category: 'Discussion', point: 'Integrated Risk Management' },
    { category: 'Discussion', point: 'Coordination and Synergy' },
    { category: 'Discussion', point: 'Improved Governance' },
    { category: 'Management1', point: 'Automated Workflow Process' },
    { category: 'Management1', point: 'System Integration' },
    { category: 'Management1', point: 'Automated Notifications and Alerts' },
    { category: 'Management1', point: 'Automated Personalization and Adaptation' },
    { category: 'Management1', point: 'Automated Analysis and Reporting' },
    { category: 'Planning1', point: 'Centralized Storage' },
    { category: 'Planning1', point: 'Collaboration and Mutuality' },
    { category: 'Planning1', point: 'Security and Access Management' },
    { category: 'Planning1', point: 'Classification and Indexing' },
    { category: 'Planning1', point: 'Integration with Other Tools' },

    { category: 'productivity', point: 'Objectives clarity' },
    { category: 'productivity', point: 'Confidence in My Planning' },
    { category: 'productivity', point: 'Time Optimization' },
    { category: 'productivity', point: 'Better Productivity“' },

    { category: 'performance', point: 'Prioritize My Tasks' },
    { category: 'performance', point: 'Organize Me Effectively' },
    { category: 'performance', point: 'Quick View My Activity' },
    { category: 'performance', point: 'Better Manage My Deadlines“' },

    { category: 'project', point: 'A Collaboration and Sharing Facilities' },
    { category: 'project', point: 'Transparent Integration' },
    { category: 'project', point: 'Accessibility and Mobility' },

    { category: 'map', point: 'Have a Transparent Communication' },
    { category: 'map', point: 'Clearly Define Roles' },
    { category: 'map', point: 'Improving Coordination' },
    { category: 'map', point: 'Align Goals' },

    { category: 'alignment', point: 'Structure My Business' },
    { category: 'alignment', point: 'Better Manage My Time' },
    { category: 'alignment', point: 'Measure My Performance' },

    { category: 'Governance', point: 'Clarifying Objectives' },
    { category: 'Governance', point: 'Resource Optimization' },
    { category: 'Governance', point: 'Improving Productivity' },
    { category: 'Governance', point: 'Managing Risk' },

    { category: 'Automated', point: ' Maximize Operational Efficiency' },
    { category: 'Automated', point: 'Improve Individual Productivity' },
    { category: 'Automated', point: 'Optimize User Experience“' },

    { category: 'Workflow', point: 'Improving Sales Consistency' },
    { category: 'Workflow', point: 'Reducing Costs and Errors' },
    { category: 'Workflow', point: 'Optimization of Reporting Processes' },
    { category: 'Workflow', point: 'Improving Operational Efficiency“' },

    { category: 'Alert', point: 'Better manage my priorities' },
    { category: 'Alert', point: 'Reduce the Risk of Forgetting' },
    { category: 'Alert', point: 'Track Everything in Real Time' },
    { category: 'Alert', point: 'Optimize Prospect Tracking“' },

    { category: 'Security', point: 'Protect Sensitive Data' },
    { category: 'Security', point: 'Better see and Control Access' },
    { category: 'Security', point: 'Strengthen Customer Trust“' },

    { category: 'Tools', point: 'Centralize Data' },
    { category: 'Tools', point: 'Better Analyze Data' },
    { category: 'Tools', point: 'Collaborate Better' },
    { category: 'Tools', point: 'Working in Agility and Scalability Mode“' },

    { category: 'Storage', point: 'Easy Access to Information' },
    { category: 'Storage', point: 'Facilitated Collaboration' },
    { category: 'Storage', point: 'a Time Saver“' },


  ];

  
 
  constructor() { }

  getManagementPoints() {
    return this.managementPoints;
  }
}
