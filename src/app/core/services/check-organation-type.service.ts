import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckOrganationTypeService {
  constructor() {}
  data = {
    message: '',
    header: '',
  };
  checkOrganationType() {
    const data = {
      DemoOrganation: localStorage.getItem('DemoOrganation'),
      userName: localStorage.getItem('userName'),
    };
    return data;
  }

  messagesandheader(screen:any) {
    let value:any
    
    if (localStorage.getItem('DemoOrganation') === 'true') {
      // "MarcVasquez"
      if (localStorage.getItem('userName') === "MarcVasquez") {
        if (screen === 'file/Note') {
          this.data.message =
            'Files and notes are of utmost importance to me. The pooling of data provides me with crucial information provided by my teams for my appointments';
          this.data.header = 'Files & Notes';
          value= this.data;
        } else if (screen === 'Setting') {
          this.data.message =
            'The profile allows me to give rights by hierarchy to my entire team, and to implement my alert strategies, particularly via targets…';
          this.data.header = 'profile';
          value= this.data;
        }
       else if (screen === 'activityReports') {
        this.data.message =
          'Reporting assesses whether StarPro strategy is achieving its objectives, allowing the strategy to be adjusted to ensure the sustainability and growth of the organization';
        this.data.header = 'Activity Reports';
        value= this.data;
      } else if (screen === 'Map') {
        this.data.message =
          'The map gives me a complete view of StarPro activities, making it easier to adjust my schedule according to priority actions and monitoring the activity of my teams.';
        this.data.header = 'Map';
        value= this.data;
      } else if (screen === 'planning') {
        this.data.message =
          'Thanks to Planning&Me, I efficiently manage my appointments, prioritize my tasks, visualize my teams availability, and measure StarPro objectives.';
        this.data.header = 'Planning';
        value= this.data;
      } else if (screen === 'Transactions') {
        this.data.message =
          'I love the ability to see all orders with the associated discounts, and to be able to adjust if necessary according to my gross margin';
        this.data.header = 'Transactions';
        value= this.data;
      } else if (screen === 'ManagementProduct') {
        this.data.message =
          'I really enjoy the ability to see what our stock represents in terms of business volume as well as the associated gross margin.';
        this.data.header = 'Management Products';
        value= this.data;
      } else if (screen === 'ManagementSite') {
        this.data.message =
          'I watch the progress of the targets by group, which gives me a precise vision of the progress of the objectives and I can thus organize my meetings if necessary';
        this.data.header = 'Sites';
        value= this.data;
      } else if (screen === 'ManagementContact') {
        this.data.message =
          'I have quick and clear access to all of my contacts, so I can interact quickly with them';
        this.data.header = 'Contacts';
        value= this.data;   
      } else if (screen === 'ManagementUser') {
        this.data.message =
          'I like to look at the targets of my team and working groups every morning, in order to have a quick overview of the objectives and to prepare my meetings with the departments concerned if necessary.';
        this.data.header = 'Users';
        value= this.data;
      }else if (screen === 'Parameters') {
        this.data.message =
          'The parameters create the link between external tools and Planning&Me. I can see precisely the different uses of P&M';
        this.data.header = 'Parameters';
        value= this.data;
      }else if (screen === 'AuditLog') {
        this.data.message =
          'The audit log gives me an overview of how my teams use the Planning&Me tool';
        this.data.header = 'Audit Log'
        value= this.data;
      }else if(screen==='Management'){
        this.data.message =
        'I can quickly see my entire StarPro team, via my collaborators, contacts, sites, products and transactions';
      this.data.header = 'Management'
      value= this.data;
      }
      }
      // "AnneBrunelle" 
      if (localStorage.getItem('userName') === "AnneBrunelle") {
        if (screen === 'file/Note') {
          this.data.message ="J'apprécie particulièrement ce module qui me permet de travail en mode projet et agile";
          this.data.header = 'Files & Notes';
          value= this.data;
        } else if (screen === 'Setting') {
          this.data.message =
            'This module allows me to interact with external Planning&Me tools. And the audit log gives me a complete view of all Planning&Me users';
          this.data.header = 'Settings';
          value= this.data;
        }
       else if (screen === 'activityReports') {
        this.data.message =
          'I love this module which allows me to have an effective vision of the results of my PAC and to be able to export my data in order to create relevant reports and presentations';
        this.data.header = 'Activity Reports';
        value= this.data;
      } else if (screen === 'Map') {
        this.data.message =
          'The map optimizes my planning, by configuring the view by appointment, customers/suppliers or prospects. It guides me for adjustments and better efficiency, by providing me with precise performance indicators';
        this.data.header = 'Map';
        value= this.data;
      } else if (screen === 'planning') {
        this.data.message =
          'The schedule, the result of my strategy, gives me an overview of my appointments with details and details.';
        this.data.header = 'Planning';
        value= this.data;
      } else if (screen === 'Transactions') {
        this.data.message =
          'Allows you to create post-national agreement discounts, generate orders and quotes, while monitoring customer and supplier transactions';
        this.data.header = 'Transactions';
        value= this.data;
      } else if (screen === 'ManagementProduct') {
        this.data.message =
          'Offers a detailed view of stock, turnover by product, brand, family or Target, guiding my necessary appointments';
        this.data.header = 'Management Products';
        value= this.data;
      } else if (screen === 'ManagementSite') {
        this.data.message =
          'I have a vision of customer/supplier sites, which can be grouped by group of BU (business unit) as well as the targets associated with them';
        this.data.header = 'Sites';
        value= this.data;
      } else if (screen === 'ManagementContact') {
        this.data.message =
          'I have a view of all of my individual or grouped contacts as well as the targets associated with them';
        this.data.header = 'Contacts';
        value= this.data;   
      } else if (screen === 'ManagementUser') {
        this.data.message =
          'I have a vision of my teams by individual, work group as well as the targets associated with them';
        this.data.header = 'Users';
        value= this.data;
      }else if (screen === 'Parameters') {
        this.data.message =
          'The parameters create the link between external tools and Planning&Me. I can see precisely the different uses of P&M';
        this.data.header = 'Parameters';
        value= this.data;
      }else if (screen === 'AuditLog') {
        this.data.message =
          'The audit log gives me an overview of how my teams use the Planning&Me tool';
        this.data.header = 'Audit Log'
        value= this.data;
      }else if(screen==='Management'){
        this.data.message =
        'Management Gives me a clear and precise vision of my users, Contacts, Sites, Products and transactions…';
      this.data.header = 'Management'
      value= this.data;
      }
      }
      // "PaulFondal" 
      if (localStorage.getItem('userName') === "PaulFondal") {
        if (screen === 'file/Note') {
          this.data.message ="Ce module me permet de faciliter la création d'échanges et de suivis au sein de mes équipes";
          this.data.header = 'Files & Notes';
          value= this.data;
        } else if (screen === 'Setting') {
          this.data.message =
            'This module is very valuable';
          this.data.header = 'Settings';
          value= this.data;
        }
       else if (screen === 'activityReports') {
        this.data.message =
          'I enjoy this module for analyzing the individual and collective performance of the sales team, monitoring key indicators and identifying areas for improvement';
        this.data.header = 'Activity Reports';
        value= this.data;
      } else if (screen === 'Map') {
        this.data.message =
          'The map makes it easier for me to plan sales tours and gives me an overview of achieving objectives via sites, customers, groups.';
        this.data.header = 'Map';
        value= this.data;
      } else if (screen === 'planning') {
        this.data.message =
          'The schedule makes it easier for me to interact with managers and teams, with full access to my teams schedules for adjustments if necessary';
        this.data.header = 'Planning';
        value= this.data;
      } else if (screen === 'Transactions') {
        this.data.message =
          'This module gives me a clear view of my teams orders and quotes, with the ability to create discounts and monitor their use by my salespeople.';
        this.data.header = 'Transactions';
        value= this.data;
      } else if (screen === 'ManagementProduct') {
        this.data.message =
          'This vision allows me to implement actions concerning products whose stock is under pressure.';
        this.data.header = 'Management Products';
        value= this.data;
      } else if (screen === 'ManagementSite') {
        this.data.message =
          'The Sites module allows me to follow the evolution of objectives, classify sites by BU via groups, and integrate discounts according to current promotional plans.';
        this.data.header = 'Sites';
        value= this.data;
      } else if (screen === 'ManagementContact') {
        this.data.message =
          'Contacts allow me to quickly see information about our customers in the event of a customer dispute, etc.';
        this.data.header = 'Contacts';
        value= this.data;   
      } else if (screen === 'ManagementUser') {
        this.data.message =
          'Users allows me to monitor the performance of my teams, set quantitative sales objectives aligned with StarPro objectives, and organize my teams into groups';
        this.data.header = 'Users';
        value= this.data;
      }else if (screen === 'Parameters') {
        this.data.message =
          'This module allows me to create exchanges with external data like Excel';
        this.data.header = 'Parameters';
        value= this.data;
      }else if (screen === 'AuditLog') {
        this.data.message =
          'The audit Log gives me a precise vision of how my Planning&Me team uses it, allowing me to adjust if necessary';
        this.data.header = 'Audit Log'
        value= this.data;
      }else if(screen==='Management'){
        this.data.message =
        'Management allows me to have a quick overview of my teams';
      this.data.header = 'Management'
      value= this.data;
      }
      }
      // "ChloeHatier" 
      if (localStorage.getItem('userName') === "ChloeHatier") {
        if (screen === 'file/Note') {
          this.data.message ="Je peux créer des groupes de notes mutualisées, tout en ayant la possibilité de créer des notes privées";
          this.data.header = 'Files & Notes';
          value= this.data;
        } else if (screen === 'Setting') {
          this.data.message =
            'I particularly appreciate the setting up of alerts to monitor my objectives and incentives';
          this.data.header = 'Settings';
          value= this.data;
        }
       else if (screen === 'activityReports') {
        this.data.message =
          'This module is essential for developing my planning, thanks to precise and customizable reports. This refines my commercial strategy according to my objectives, thus optimizing the appointments in my schedule';
        this.data.header = 'Activity Reports';
        value= this.data;
      } else if (screen === 'Map') {
        this.data.message =
          'I appreciate the map, for its quick view of my clients and its contribution to the creation of my schedule. It also allows the identification and monitoring of my prospects to develop my customer portfolio.';
        this.data.header = 'Map';
        value= this.data;
      } else if (screen === 'planning') {
        this.data.message =
          'I love… the schedule, it allows me to quickly see all the elements linked to my appointments. In addition, I can create private meetings, which makes my family life easier…';
        this.data.header = 'Planning';
        value= this.data;
      } else if (screen === 'Transactions') {
        this.data.message =
          'I really like transactions because I can generate quotes and see all the discounts I can apply. In addition, I have a precise vision of all of my orders.';
        this.data.header = 'Transactions';
        value= this.data;
      } else if (screen === 'ManagementProduct') {
        this.data.message =
          'I use the product section, mainly to see the quantities available, and to have the product sheets such as the technical sheet, use sheet';
        this.data.header = 'Management Products';
        value= this.data;
      } else if (screen === 'ManagementSite') {
        this.data.message =
          'I appreciate the global vision of my sites, in particular their detailed sheets which provide all the necessary information, including product referencing specific to each site';
        this.data.header = 'Sites';
        value= this.data;
      } else if (screen === 'ManagementContact') {
        this.data.message =
          'My contacts give me a quick overview of my customers and allow me to group my customers by group. I can even establish targets according to my own objectives';
        this.data.header = 'Contacts';
        value= this.data;   
      } else if (screen === 'ManagementUser') {
        this.data.message =
          'The users part gives me access to my profile and my targets set up by my management';
        this.data.header = 'Users';
        value= this.data;
      }else if (screen === 'Parameters') {
        this.data.message =
          'This module allows me to create exchanges with external data like Excel';
        this.data.header = 'Parameters';
        value= this.data;
      }else if (screen === 'AuditLog') {
        this.data.message =
          'The audit Log gives me a precise vision of how my Planning&Me team uses it, allowing me to adjust if necessary';
        this.data.header = 'Audit Log'
        value= this.data;
      }else if(screen==='Management'){
        this.data.message =
        'This module allows me to have all of my information grouped together';
      this.data.header = 'Management'
      value= this.data;
      }
      }

      // "AlainDupel"
       if (localStorage.getItem('userName') === "AlainDupel") {
          if (screen === 'file/Note') {
            this.data.message =
              'Files & Notes facilitate collaboration with all StarPro teams, for efficient coordination and optimal customer satisfaction. In addition, the creation of private notes simplifies customer follow-up, thus avoiding the use of a paper notepad.';
            this.data.header = 'Files & Notes';
            value= this.data;
          } else if (screen === 'Setting') {
            this.data.message =
              'The little hidden pleasure is setting up alerts regarding the achievement of my incentives…';
            this.data.header = 'Settings';
            value= this.data;
          }
         else if (screen === 'activityReports') {
          this.data.message =
            'Activity reports are an essential tool for developing my planning because it allows me to make reports and thus refine my commercial strategy according to my objectives.';
          this.data.header = 'Activity Reports';
          value= this.data;
        } else if (screen === 'Map') {
          this.data.message =
            'I appreciate the map, for its quick view of my clients and its contribution to the creation of my schedule. It also allows the identification and monitoring of my prospects to develop my customer portfolio.';
          this.data.header = 'Map';
          value= this.data;
        } else if (screen === 'planning') {
          this.data.message =
            'the schedule is really very well done, it allows me to quickly see all of my appointments. The notes and attached files allow me to have effective monitoring';
          this.data.header = 'Planning';
          value= this.data;
        } else if (screen === 'Transactions') {
          this.data.message =
            'I love transactions because I can generate quotes and see all the discounts I can apply. In addition, I can directly create orders and that’s a real plus for me…';
          this.data.header = 'Transactions';
          value= this.data;
        } else if (screen === 'ManagementProduct') {
          this.data.message =
            'I use the product section, mainly to see the quantities available, and to have the product sheets such as the technical sheet, use sheet';
          this.data.header = 'Management Products';
          value= this.data;
        } else if (screen === 'ManagementSite') {
          this.data.message =
            'I really like this vision on all of my sites, especially with their files which give me precisely all the information I need to know';
          this.data.header = 'Sites';
          value= this.data;
        } else if (screen === 'ManagementContact') {
          this.data.message =
            'My contacts give me a detailed profile of my customers and allow me to group customers together. I can even establish targets according to my own objectives';
          this.data.header = 'Contacts';
          value= this.data;   
        } else if (screen === 'ManagementUser') {
          this.data.message =
            'The users part gives me access to my profile and my targets set up by my management';
          this.data.header = 'Users';
          value= this.data;
        }else if (screen === 'Parameters') {
          this.data.message =
            'This module allows me to create exchanges with external data like Excel';
          this.data.header = 'Parameters';
          value= this.data;
        }else if (screen === 'AuditLog') {
          this.data.message =
            'The audit Log gives me a precise vision of how my Planning&Me team uses it, allowing me to adjust if necessary';
          this.data.header = 'Audit Log'
          value= this.data;
        }else if(screen==='Management'){
          this.data.message =
          'This module allows me to have all of my information grouped together';
        this.data.header = 'Management'
        value= this.data;
        }
        }
    }
    return value
  }
}
