import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { GraphService } from './graph.service';

@Injectable({ providedIn: 'root' })
export class ActivityReportDataFormatService {
  formatdata :any= []
  finalresult :any= []
  ReadyToFormat :any= []
  result :any= {
    name: '',
    showBuy: '',
    showSale: '',
    showMargin: '',
    title: '',
    isSeperate: '',
    reportId: '',
    startDate: '',
    endDate: '',
    description: '',
    keyword: '',
    dateLabel: '',
    typeOfChart: '',
    xlableName: '',
    ylableName: '',
    isEvent: '',
    yaxisLabelName: '',
    singleUser: '',
    ReportData: [],
  }
  dummybarchart :any= [];
  dummybuyGraphsDtos :any= []
  dummysaleGraphsDtos :any= [];
  dummylinechart :any= [];
  dummymarginlinechart :any= [];
  marginlinechartbar :any= [];
  tableheader :any= [];
  pivotTable :any= [];
  tableCellData: any[] = [];
  dummyareachart :any= [];
  allReports:any;
  allReports1:any;
  lastFourSaveedReports :any= [];



  constructor(
    public datepipe: DatePipe,
    private graphService: GraphService,
  ) {
  }



  formatDate(value:any) {
    console.log(value)
    return this.datepipe.transform(value, 'dd-MMM-yyyy')
  }

  GetAllSavedCharts() {
    this.graphService.getAllSavedReports().subscribe((data: any) => {
      if (data) {
        this.allReports = data
        this.showDefaultCharts(this.allReports)
      }
    });

  }

  showDefaultCharts(allReports:any) {
    console.log(allReports)
    allReports.forEach((report:any) => {
      this.lastFourSaveedReports.push(report.id);
    })
    setTimeout(() => {
      this.graphService.generateReports(this.lastFourSaveedReports).subscribe(data => {
        this.dataformat(data)
      });
    }, 100);

  }

  getReporDetails(data:any, saveReport:any) {
    if (saveReport == true) {
      this.GetAllSavedCharts()
    } else {
      if (data) {
        this.graphService.filterForGraph(data).subscribe(result => {
          this.dataformat([result])
        })
      } else {
        this.graphService.generateReports(this.lastFourSaveedReports).subscribe(data => {
          this.dataformat(data)
        });
      }

    }
  }


  dataformat(result: any) {
    console.log(result, 'result')
    result.forEach((element: any) => {
      this.dummybarchart = [];
      this.dummybuyGraphsDtos = []
      this.dummysaleGraphsDtos = [];
      this.dummylinechart = [];
      this.dummymarginlinechart = [];
      this.marginlinechartbar = [];
      this.tableheader = [];
      this.pivotTable = [];
      this.tableCellData = [];
      this.dummyareachart = [];
      this.result.showBuy = element?.isBuy,
        this.result.showSale = element?.isSale,
        this.result.showMargin = element?.withMargin,
        this.result.title = element?.reportTitle,
        this.result.isSeperate = element?.isBuySeparateChart,
        this.result.reportId = element?.reportId,
        this.result.startDate = element?.startDate,
        this.result.endDate = element?.endDate,
        this.result.description = element?.description,
        this.result.keyword = element?.keywords,
        this.result.typeOfChart = element?.chartType,
        this.result.xlableName = element?.xDisplayType,
        this.result.ylableName = element?.yDisplayType,
        this.result.isEvent = element?.isEvent,
        this.result.dateLabel = new Date(element?.startDate).getDate() + '/' + (new Date(element?.startDate).getMonth() + 1) + '/' + new Date(element?.startDate).getFullYear() + '-' + new Date(element?.endDate).getDate() + '/' + (new Date(element?.endDate).getMonth() + 1) + '/' + new Date(element?.endDate).getFullYear();
      // 00000000000 
      if (element?.isEvent == false && element?.yDisplayType == "Amount") {
        this.result.yaxisLabelName = 'Transaction Amount ( € )'
      }
      // 111111111111 
      else if (element?.isEvent == false && element?.yDisplayType == "Quantity") {
        this.result.yaxisLabelName = 'Number of Transaction'
      }
      // 2222222222222222 
      else if (element?.isEvent == true && element?.yDisplayType == "Quantity") {
        this.result.yaxisLabelName = 'Number of Event'
      }
      // 333333333333333 
      else if (element?.isEvent == true && element?.yDisplayType == "Duration") {
        this.result.yaxisLabelName = ' Event Duration ( Hours )'
      }

      // 0000000001111111111 
      // Transation Reports 
      if (element?.isEvent == false) {
        // Bar Chart' Vertical bar chart 
        if (element?.chartType == 'Bar Chart' || element?.chartType == 'Vertical bar chart') {
          // Sell Grap 
          if (element?.isSale == true && element?.isBuy == false && element?.withMargin == false) {
            this.result.name = 'Sell Grap'
            // single user 
            if (element?.graphDtos.length == 1) {
              this.result.singleUser = 'true'
              if (element?.yDisplayType == 'Daily') {
                element?.graphDtos[0].saleGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: this.formatDate(element?.date), value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)
              }
              else if (element?.yDisplayType == 'Monthly') {
                element?.graphDtos[0].saleGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.month, value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else if (element?.yDisplayType == 'No Period') {
                element?.graphDtos[0].saleGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.saleTotal : 0 })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else {
                element?.graphDtos[0].saleGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.year.toString(), value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              }
            }
            // multi user 
            else if (element?.graphDtos.length > 1) {
              this.result.singleUser = 'false'
              if (element?.yDisplayType == 'No Period') {
                element?.graphDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.saleTotal : 0 })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else if (element?.yDisplayType == 'Yearly') {
                element?.graphDtos.forEach((element:any) => {
                  element?.saleGraphsDtos.forEach((e:any) => {
                    this.finalresult.push({
                      name: e.year.toString(),
                      series: [{ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity, }]
                    })
                  })
                });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)
              } else if (element?.yDisplayType == 'Daily') {
                element?.graphDtos.forEach((element:any) => {
                  element?.saleGraphsDtos.forEach((e:any) => {
                    this.ReadyToFormat.push({
                      name: this.formatDate(e.date),
                      series: [{ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity, }]
                    })
                  })
                });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)
              } else if (element?.yDisplayType == 'Monthly') {
                element?.graphDtos.forEach((element:any) => {
                  element?.saleGraphsDtos.forEach((e:any) => {
                    this.ReadyToFormat.push({
                      name: e.month,
                      series: [{ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity, }]
                    })
                  })
                });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)
              }
            }
          }
          // Buy Grap 
          else if (element?.isSale == false && element?.isBuy == true && element?.withMargin == false) {
            this.result.name = 'Buy Grap'
            // single 
            if (element?.graphDtos.length == 1) {
              this.result.singleUser = 'true'
              if (element?.yDisplayType == 'Daily') {
                element?.graphDtos[0].buyGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: this.formatDate(element?.date), value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              }
              else if (element?.yDisplayType == 'Monthly') {
                element?.graphDtos[0].buyGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.month, value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else if (element?.yDisplayType == 'No Period') {
                element?.graphDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.buyTotal : 0 })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else {
                element?.graphDtos[0].buyGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.year.toString(), value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              }
            }
            // multi data 
            else if (element?.graphDtos.length > 1) {
              this.result.singleUser = 'false'
              if (element?.yDisplayType == 'No Period') {
                element?.graphDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.saleTotal : 0 })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else if (element?.yDisplayType == 'Yearly') {
                element?.graphDtos.forEach((element:any) => {
                  element?.buyGraphsDtos.forEach((e:any) => {
                    this.ReadyToFormat.push({
                      name: e.year.toString(),
                      series: [{ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity, }]
                    })
                  })
                });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else if (element?.yDisplayType == 'Daily') {
                element?.graphDtos.forEach((element:any) => {
                  element?.buyGraphsDtos.forEach((e:any) => {
                    this.ReadyToFormat.push({
                      name: this.formatDate(e.date),
                      series: [{ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity, }]
                    })
                  })
                });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else if (element?.yDisplayType == 'Monthly') {
                element?.graphDtos.forEach((element:any) => {
                  element?.buyGraphsDtos.forEach((e:any) => {
                    this.ReadyToFormat.push({
                      name: e.month,
                      series: [{ name: element?.itemName, value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity, }]
                    })
                  })
                });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)
              }
            }
          }
          // Sell Graph And Margin Graph 
          else if (element?.isSale == true && element?.isBuy == false && element?.withMargin == true) {
            this.result.name = 'Sell Graph And Margin Graph'
            // single user 
            if (element?.graphDtos.length == 1) {
              if (element?.yDisplayType == 'Daily') {
                // ---------------- 
                element?.graphDtos.forEach((e:any) => {
                  let result = []
                  result.push({ name: 'Sale Total', value: e.saleTotal });
                  result.push({ name: 'Margin Total', value: e.marginTotal });
                  this.ReadyToFormat.push({ name: e.itemName, series: result })
                });
                // -------------- 
                element?.graphDtos[0].saleGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: this.formatDate(element?.date), value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })

                })
                element?.graphDtos[0].saleMarginGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: this.formatDate(element?.date), value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              }
              else if (element?.yDisplayType == 'Monthly') {
                // ------------ 
                element?.graphDtos.forEach((e:any) => {
                  let result = []
                  result.push({ name: 'Sale Total', value: e.saleTotal });
                  result.push({ name: 'Margin Total', value: e.marginTotal });
                  this.ReadyToFormat.push({ name: e.itemName, series: result })
                });
                // ------------- 
                element?.graphDtos[0].saleGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.month, value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })

                element?.graphDtos[0].saleMarginGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.month, value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              } else if (element?.yDisplayType == 'Yearly') {
                element?.graphDtos[0].saleGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.year.toString(), value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })

                element?.graphDtos[0].saleMarginGraphsDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.year.toString(), value: element?.yDisplayType.toLowerCase() == 'amount' ? element?.price : element?.quantity })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              }
            }
            // Multi user 
            else if (element?.graphDtos.length > 1) {
              element?.graphDtos.forEach((e:any) => {
                let result = []
                result.push({ name: 'Sale Total', value: e.saleTotal });
                result.push({ name: 'Margin Total', value: e.marginTotal });
                this.ReadyToFormat.push({ name: e.itemName, series: result })
              });
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)
            }
          }
          // 'Sell Graph And Buy Graph' 
          else if (element?.isSal == true && element?.isBuy == true && element?.withMargin == false) {
            this.result.name = 'Sell Graph And Buy Graph'
            if (element?.graphDtos.length == 1) {
              element?.graphDtos.forEach((element:any) => {
                this.dummysaleGraphsDtos = element?.saleGraphsDtos;
                this.dummybuyGraphsDtos = element?.buyGraphsDtos;
                if (element?.isBuySeparateChart == false) {
                  this.dummybarchart = [];
                  this.dummysaleGraphsDtos.forEach((sale:any) => {
                    this.dummybuyGraphsDtos.filter((element:any) => {
                      if (sale.year == element?.year) {
                        this.ReadyToFormat.push({
                          name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(sale.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? sale.month + ' ' + sale.year.toString() : sale.year.toString(),
                          value: element?.yDisplayType.toLowerCase() == 'amount' ? sale.price + element?.price : sale.quantity + element?.quantity
                        });
                      }
                    })
                  })
                  this.result.ReportData = this.ReadyToFormat

                  this.formatdata.push(this.result)
                }
                else {
                  this.dummysaleGraphsDtos.forEach((sale:any) => {
                    this.dummybarchart.push({ name: 'SaleTotal', value: element?.yDisplayType.toLowerCase() == 'amount' ? sale.price : sale.quantity })
                  })
                  this.dummybuyGraphsDtos.forEach((buy:any) => {
                    this.dummybarchart.push({ name: 'BuyTotal', value: element?.yDisplayType.toLowerCase() == 'amount' ? buy.price : buy.quantity })
                  })
                  this.ReadyToFormat.push({ name: element?.itemName, series: this.dummybarchart })
                  this.result.ReportData = this.ReadyToFormat

                  this.formatdata.push(this.result)
                }
              })
            }
            //multiple
            else if (element?.graphDtos.length > 1) {
              if (element?.isBuySeparateChart == false) {
                element?.graphDtos.forEach((element:any) => {
                  this.ReadyToFormat.push({ name: element?.itemName, value: element?.saleTotal + element?.buyTotal })
                })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              }
              else {
                element?.graphDtos.forEach((e:any) => {
                  this.dummybarchart.push({ name: 'Sale Total', value: e.saleTotal });
                  this.dummybarchart.push({ name: 'Buy Total', value: e.buyTotal });
                  this.ReadyToFormat.push({ name: e.itemName, series: this.dummybarchart })
                  this.dummybarchart = []
                });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              }
            }
          }
        }
        // Pie Chart 
        else if (element?.chartType == 'Pie Chart') {
          element?.graphDtos.forEach((element:any) => {
            this.ReadyToFormat.push({ name: element?.itemName, value: element?.saleTotal })
          });
          this.result.ReportData = this.ReadyToFormat

          this.formatdata.push(this.result)

        }
        // Line Chart 
        else if (element?.chartType == 'Line Chart') {
          if (element?.yDisplayType == 'Amount') {
            if (element?.isSal == true && element?.isBuy == false && element?.withMargin == false) {
              this.result.name = 'Sell Graph'
              element?.graphDtos.forEach((element:any) => {
                this.dummylinechart = [];
                element?.saleGraphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                });
                this.ReadyToFormat.push({ name: element?.itemName, series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              });
            }
            else if (element?.isSal == false && element?.isBuy == true && element?.withMargin == false) {
              this.result.name = 'Buy Graph'
              element?.graphDtos.forEach((element:any) => {
                this.dummylinechart = [];
                element?.buyGraphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                });
                this.ReadyToFormat.push({ name: element?.itemName, series: this.dummylinechart });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              });
            }

            else if (element?.isSal == true && element?.isBuy == false && element?.withMargin == true) {
              this.result.name = 'Sell Graph'
              element?.graphDtos.forEach((element:any) => {
                this.dummylinechart = [];
                this.dummymarginlinechart = [];
                element?.saleGraphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                });
                this.ReadyToFormat.push({ name: element?.itemName + ' (Sell)', series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

                this.dummylinechart = [];
                element?.saleMarginGraphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });

                })
                this.ReadyToFormat.push({ name: element?.itemName + ' (margin)', series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)


              });


            }

            else if (element?.isSal == true && element?.isBuy == true && element?.withMargin == false) {
              this.result.name = 'Sell Graph And Buy Graph'
              element?.graphDtos.forEach((element:any) => {
                this.dummylinechart = [];
                if (element?.isBuySeparateChart == false) {
                  this.dummysaleGraphsDtos = element?.saleGraphsDtos;
                  this.dummybuyGraphsDtos = element?.buyGraphsDtos;
                  this.dummysaleGraphsDtos.forEach((sale:any) => {
                    this.dummybuyGraphsDtos.forEach((element:any) => {
                      if (sale.month == element?.month) {
                        this.dummylinechart.push({
                          name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(sale.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? sale.month + ' ' + sale.year.toString() : sale.year.toString(),
                          value: sale.price + element?.price
                        });
                      }
                    })
                  })
                  this.ReadyToFormat.push({ name: element?.itemName, series: this.dummylinechart })
                  this.result.ReportData = this.ReadyToFormat

                  this.formatdata.push(this.result)

                }
                else {
                  this.dummylinechart = [];
                  element?.saleGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                    });
                  });
                  this.ReadyToFormat.push({ name: element?.itemName + ' (Sell)', series: this.dummylinechart })
                  this.result.ReportData = this.ReadyToFormat

                  this.formatdata.push(this.result)

                  this.dummylinechart = [];
                  element?.buyGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                    });
                  });
                  this.ReadyToFormat.push({ name: element?.itemName + ' (Buy)', series: this.dummylinechart })
                  this.result.ReportData = this.ReadyToFormat

                  this.formatdata.push(this.result)

                }
              });

            }
          }
          else if (element?.yDisplayType == 'Quantity') {
            if (element?.isSal == true && element?.isBuy == false && element?.withMargin == false) {
              this.result.name = 'Sell Graph '
              element?.graphDtos.forEach((element:any) => {
                this.dummylinechart = [];
                element?.saleGraphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                });
                this.ReadyToFormat.push({ name: element?.itemName, series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              });


            }
            else if (element?.isSal == false && element?.isBuy == true && element?.withMargin == false) {
              this.result.name = 'Buy Graph'
              element?.graphDtos.forEach((element:any) => {
                this.dummylinechart = [];
                element?.buyGraphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                });
                this.ReadyToFormat.push({ name: element?.itemName, series: this.dummylinechart });
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              });
            }
            else if (element?.isSal == true && element?.isBuy == true && element?.withMargin == false) {
              this.result.name = 'Sell Graph And Buy Graph'
              element?.graphDtos.forEach((element:any) => {
                this.dummylinechart = [];
                element?.saleGraphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                });
                this.ReadyToFormat.push({ name: element?.itemName + ' (Sell)', series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

                this.dummylinechart = [];
                element?.buyGraphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                });
                this.ReadyToFormat.push({ name: element?.itemName + ' (Buy)', series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              });


            }
          }
        }
        // Pivot Table 
        else if (element?.chartType == 'Pivot Table') {
          if (element?.isSale == true && element?.isBuy == false && element?.withMargin == false) {
            this.result.name = 'Sell Table'
            element?.graphDtos.forEach((element:any) => {
              this.tableheader.push(element?.itemName);
              element?.saleGraphsDtos.forEach((e:any) => {
                this.pivotTable.push({
                  year: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                  value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity, sellValue: 0
                });
              });

            });
            this.ReadyToFormat = this.groupByType(this.pivotTable);
            this.result.ReportData = this.ReadyToFormat

            this.formatdata.push(this.result)

          } else if (element?.isSale == false && element?.isBuy == true && element?.withMargin == false) {
            this.result.name = 'Buy Table'
            element?.graphDtos.forEach((element:any) => {
              this.tableheader.push(element?.itemName);
              element?.buyGraphsDtos.forEach((e:any) => {
                this.pivotTable.push({
                  year: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                  value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity,
                  sellValue: 0
                });
              });

            });
            this.ReadyToFormat = this.groupByType(this.pivotTable);
            this.result.ReportData = this.ReadyToFormat

            this.formatdata.push(this.result)

          } else if (element?.isSale == true && element?.isBuy == false && element?.withMargin == true) {
            this.result.name = 'Sell and Margin Table'
            element?.graphDtos.forEach((element:any) => {
              this.tableheader.push(element?.itemName);
              console.log(this.tableheader);
              element?.saleGraphsDtos.forEach((e:any) => {
                element?.saleMarginGraphsDtos.forEach((margin:any) => {
                  if (margin.year === e.year) {
                    this.pivotTable.push({
                      year: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      sellValue: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity,
                      value: element?.yDisplayType.toLowerCase() == 'amount' ? margin.price : margin.quantity
                    });
                  }
                });
              });

            });
            this.tableheader.forEach((ele:any) => {
              const tableCell = { buy: 'Sell', sell: 'Margin' };
              this.tableCellData.push(tableCell);
            });
            this.ReadyToFormat = this.groupByType(this.pivotTable);
            this.result.ReportData = this.ReadyToFormat

            this.formatdata.push(this.result)

          } else if (element?.isSale == true && element?.isBuy == true && element?.withMargin == false) {
            this.result.name = 'Sell and Buy Table'
            element?.graphDtos.forEach((element:any) => {
              this.tableheader.push(element?.itemName);
              element?.buyGraphsDtos.forEach((e:any) => {
                element?.saleGraphsDtos.forEach((margin:any) => {
                  if (margin.year === e.year) {
                    this.pivotTable.push({
                      year: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      sellValue: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity,
                      value: element?.yDisplayType.toLowerCase() == 'amount' ? margin.price : margin.quantity
                    });
                  }
                });
              });

            });
            this.tableheader.forEach((ele:any) => {
              const tableCell = { buy: 'Buy', sell: 'Sell' };
              this.tableCellData.push(tableCell);
            });
            this.ReadyToFormat = this.groupByType(this.pivotTable);
            this.result.ReportData = this.ReadyToFormat

            this.formatdata.push(this.result)

          }

        }
        // Pie Doughnut Chart 
        else if (element?.chartType == 'Pie Doughnut Chart') {
          element?.graphDtos.forEach((element:any) => {
            this.ReadyToFormat.push({
              name: element?.itemName,
              value: element?.saleTotal
            })
          });
          this.result.ReportData = this.ReadyToFormat

          this.formatdata.push(this.result)
        }
        // Area Chart 
        else if (element?.chartType == 'Area Chart') {
          this.dummyareachart = [];
          if (element?.isBuy == true && element?.isSale == true) {
            element?.graphDtos.forEach((element:any) => {
              let data1:any = []
              let data2:any = []
              element?.saleGraphsDtos.forEach((e:any) => {
                if (element?.xDisplayType.toLowerCase() == 'daily') {
                  data1.push({
                    name: this.formatDate(e.date),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                } else if (element?.xDisplayType.toLowerCase() == 'monthly') {
                  data1.push({
                    name: e.month + ' ' + e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                } else {
                  data1.push({
                    name: e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                }
              });
              element?.buyGraphsDtos.forEach((e:any) => {
                if (element?.xDisplayType.toLowerCase() == 'daily') {
                  data2.push({
                    name: this.formatDate(e.date),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                } else if (element?.xDisplayType.toLowerCase() == 'monthly') {
                  data2.push({
                    name: e.month + ' ' + e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                } else {
                  data2.push({
                    name: e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                }
              });
              this.ReadyToFormat.push(
                { name: element?.itemName, series: data1 },
                { name: element?.itemName, series: data2 }
              )
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)
            });
          }
          else if (element?.isSale == true && element?.isBuy == false) {
            element?.graphDtos.forEach((element:any) => {
              element?.saleGraphsDtos.forEach((e:any) => {
                if (element?.xDisplayType.toLowerCase() == 'daily') {
                  this.dummyareachart.push({
                    name: this.formatDate(e.date),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                } else if (element?.xDisplayType.toLowerCase() == 'monthly') {
                  this.dummyareachart.push({
                    name: e.month + ' ' + e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                } else {
                  this.dummyareachart.push({
                    name: e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                }

              });
              this.ReadyToFormat.push({
                name: element?.itemName,
                series: this.dummyareachart
              })
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)

            });
          } else if (element?.isBuy == true && element?.isSale == false) {
            element?.graphDtos.forEach((element:any) => {
              element?.buyGraphsDtos.forEach((e:any) => {
                if (element?.xDisplayType.toLowerCase() == 'daily') {
                  this.dummyareachart.push({
                    name: this.formatDate(e.date),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                } else if (element?.xDisplayType.toLowerCase() == 'monthly') {
                  this.dummyareachart.push({
                    name: e.month + ' ' + e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                } else {
                  this.dummyareachart.push({
                    name: e.year.toString(),
                    value: element?.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity
                  });
                }

              });
              this.ReadyToFormat.push({
                name: element?.itemName,
                series: this.dummyareachart
              })
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)

            });
          }

        }

      }
      // Event Reports 
      else if (element?.isEvent == true) {
        this.result.name = 'Event Graph'
        // Bar Chart' Vertical bar chart   
        if (element?.chartType == 'Bar Chart' || element?.chartType == 'Vertical bar chart') {
          if (element?.eventGraphDtos.length == 1) {
            // --------- tttttttttttt
            if (element?.xDisplayType == 'Daily') {
              element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                this.ReadyToFormat.push({
                  name: this.formatDate(element?.date),
                  value: element?.yDisplayType.toLowerCase() == 'Quantity' ? element?.eventsId : element?.quantity
                })
              })
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)

            }
            else if (element?.xDisplayType == 'Monthly') {
              element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                this.ReadyToFormat.push({
                  name: element?.month,
                  value: element?.yDisplayType.toLowerCase() == 'Quantity' ? element?.eventsId : element?.quantity
                })
              })
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)

            } else {
              element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                this.ReadyToFormat.push({
                  name: element?.year.toString(),
                  value: element?.yDisplayType == 'Quantity' ? element?.eventsId : element?.duration
                })
              })
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)
            }
          }
          else if (element?.eventGraphDtos.length > 1) {
            element?.eventGraphDtos.forEach((element:any) => {
              this.ReadyToFormat.push({
                name: element?.itemName,
                value: element?.yDisplayType == 'Quantity' ? element?.totalQuantity : element?.totalDuration
              })
            });
            this.result.ReportData = this.ReadyToFormat

            this.formatdata.push(this.result)
          }
        }
        // Pie Chart 
        else if (element?.chartType == 'Pie Chart') {
          element?.eventGraphDtos.forEach((element:any) => {
            this.ReadyToFormat.push({
              name: element?.itemName,
              value: element?.yDisplayType == 'Quantity' ? element?.totalQuantity : element?.totalDuration
            })
          });
          this.result.ReportData = this.ReadyToFormat

          this.formatdata.push(this.result)
        }
        // Pie Doughnut Chart' 
        else if (element?.chartType == 'Pie Doughnut Chart') {
          element?.eventGraphDtos.forEach((element:any) => {
            this.ReadyToFormat.push({
              name: element?.itemName,
              value: element?.yDisplayType == 'Quantity' ? element?.totalQuantity : element?.totalDuration
            })
          });
          this.result.ReportData = this.ReadyToFormat

          this.formatdata.push(this.result)

        }
        // Line Chart 
        else if (element?.chartType == 'Line Chart') {
          if (element?.eventGraphDtos.length == 1) {
            if (element?.xDisplayType == 'Daily') {
              element?.eventGraphDtos.forEach((e:any) => {
                element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                  this.dummylinechart.push({
                    name: this.formatDate(element?.date),
                    value: element?.yDisplayType == 'Quantity' ? element?.quantity : element?.duration
                  })
                })
                this.ReadyToFormat.push({ name: e.itemName, series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)
              })

            } else if (element?.xDisplayType == 'Monthly') {
              element?.eventGraphDtos.forEach((e:any) => {
                element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                  this.dummylinechart.push({
                    name: element?.month,
                    value: element?.yDisplayType == 'Quantity' ? element?.quantity : element?.duration
                  })
                })
                console.log(this.dummylinechart, 'multiplesalbar')
                this.ReadyToFormat.push({ name: e.itemName, series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              })
            } else {
              element?.eventGraphDtos.forEach((e:any) => {
                element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                  this.dummylinechart.push({
                    name: element?.year.toString(),
                    value: element?.yDisplayType == 'Quantity' ? element?.quantity : element?.duration
                  })
                })
                this.ReadyToFormat.push({ name: e.itemName, series: this.dummylinechart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              })

            }


          } else if (element?.eventGraphDtos.length > 1)
            element?.eventGraphDtos.forEach((element:any) => {
              this.dummylinechart = [];
              element?.graphsDtos.forEach((e:any) => {
                this.dummylinechart.push({
                  name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                  value: element?.yDisplayType == 'Quantity' ? e.quantity : e.duration
                });
              });
              this.ReadyToFormat.push({ name: element?.itemName, series: this.dummylinechart })
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)

            });

        }
        // Area Chart 
        else if (element?.chartType == 'Area Chart') {
          if (element?.eventGraphDtos.length == 1) {
            if (element?.xDisplayType == 'Daily') {
              element?.eventGraphDtos.forEach((e:any) => {
                element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                  this.dummyareachart.push({ name: this.formatDate(element?.date), value: element?.yDisplayType == 'Quantity' ? element?.quantity : element?.duration })
                })
                this.ReadyToFormat.push({ name: e.itemName, series: this.dummyareachart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              })

            } else if (element?.xDisplayType == 'Monthly') {
              element?.eventGraphDtos.forEach((e:any) => {
                element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                  this.dummyareachart.push({ name: element?.month, value: element?.yDisplayType == 'Quantity' ? element?.quantity : element?.duration })
                })
                this.ReadyToFormat.push({ name: e.itemName, series: this.dummyareachart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              })
            } else {
              element?.eventGraphDtos.forEach((e:any) => {
                element?.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                  this.dummyareachart.push({
                    name: element?.year.toString(),
                    value: element?.yDisplayType == 'Quantity' ? element?.quantity : element?.duration
                  })
                })
                this.ReadyToFormat.push({ name: e.itemName, series: this.dummyareachart })
                this.result.ReportData = this.ReadyToFormat

                this.formatdata.push(this.result)

              })

            }


          } else if (element?.eventGraphDtos.length > 1) {
            element?.eventGraphDtos.forEach((element:any) => {
              this.dummyareachart = [];
              element?.graphsDtos.forEach((e:any) => {
                this.dummyareachart.push({
                  name: element?.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : element?.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                  value: element?.yDisplayType == 'Quantity' ? element?.quantity : element?.duration
                });
              });
              this.ReadyToFormat.push({ name: element?.itemName, series: this.dummyareachart })
              this.result.ReportData = this.ReadyToFormat

              this.formatdata.push(this.result)

            });
          }
        }
      }
    });
    setTimeout(() => {
      console.log(this.formatdata)
      this.response(this.formatdata)
    },);
  }



  response(data:any) {

  }


  // end ========= 
  groupByType(array:any) {
    return array.reduce(function (r:any, a:any) {
      console.log(r);
      console.log(a);
      r[a.year] = r[a.year] || [];
      r[a.year].push({ value: a.value, sellValue: a.sellValue });
      return r;
    }, Object.create(null));
  }

  yLeftAxisScale(min:any, max:any) { return { min: `${min}`, max: `${max}` }; }

  yRightAxisScale(min:any, max:any) { return { min: `${min}`, max: `${max}` }; }

  yLeftTickFormat(data:any) { return `${data.toLocaleString()}`; }

  yRightTickFormat(data:any) { return `${data}%`; }
}


