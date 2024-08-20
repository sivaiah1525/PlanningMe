import {
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { scaleBand, scaleLinear, scalePoint, scaleTime } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { BaseChartComponent, LineSeriesComponent, ViewDimensions, ColorHelper, calculateViewDimensions } from '@swimlane/ngx-charts';


@Component({
  selector: 'combo-chart-component',
  template: `
    <ngx-charts-chart
      [view]="[width + legendSpacing, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)"
    >
      <svg:g [attr.transform]="transform" class="bar-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [tickFormatting]="xAxisTickFormatting"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [yOrient]="yOrientLeft"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [tickFormatting]="yAxisTickFormatting"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScaleLine"
          [dims]="dims"
          [yOrient]="yOrientRight"
          [showGridLines]="showGridLines"
          [showLabel]="showRightYAxisLabel"
          [labelText]="yAxisLabelRight"
          [tickFormatting]="yRightAxisTickFormatting"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g
          ngx-combo-charts-series-vertical
          [xScale]="xScale"
          [yScale]="yScale"
          [colors]="colors"
          [series]="results"
          [seriesLine]="lineChart"
          [dims]="dims"
          [gradient]="gradient"
          tooltipDisabled="true"
          [activeEntries]="activeEntries"
          [animations]="animations"
          [noBarWhenZero]="noBarWhenZero"
          (activate)="onActivate($event)"
          (deactivate)="onDeactivate($event)"
          (bandwidth)="updateLineWidth($event)"
          (select)="onClick($event)"
        ></svg:g>
      </svg:g>
      <svg:g [attr.transform]="transform" class="line-chart chart">
        <svg:g>
          <svg:g *ngFor="let series of lineChart; trackBy: trackBy">
            <svg:g
              ngx-charts-line-series
              [xScale]="xScaleLine"
              [yScale]="yScaleLine"
              [colors]="colorsLine"
              [data]="series"
              [activeEntries]="activeEntries"
              [scaleType]="scaleType"
              [curve]="curve"
              [rangeFillOpacity]="rangeFillOpacity"
              [animations]="animations"
            />
          </svg:g>

          <svg:g
            ngx-charts-tooltip-area
            *ngIf="!tooltipDisabled"
            [dims]="dims"
            [xSet]="xSet"
            [xScale]="xScaleLine"
            [yScale]="yScaleLine"
            [results]="combinedSeries"
            [colors]="colorsLine"
            [tooltipDisabled]="tooltipDisabled"
            (hover)="updateHoveredVertical($event)"
          />

          <svg:g *ngFor="let series of lineChart">
            <svg:g
              ngx-charts-circle-series
              [xScale]="xScaleLine"
              [yScale]="yScaleLine"
              [colors]="colorsLine"
              [data]="series"
              [xAxis]="true"
              [yAxis]="true"
              [scaleType]="scaleType"
              [visibleValue]="hoveredVertical"
              [activeEntries]="activeEntries"
              [tooltipDisabled]="tooltipDisabled"
              (select)="onClick($event, series)"
              (activate)="onActivate($event)"
              (deactivate)="onDeactivate($event)"
            />
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['./combo-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComboChartComponent extends BaseChartComponent {
  @Input() curve: any = curveLinear;
  @Input() legend = false;
  @Input() legendTitle = 'Legend';
  @Input() legendPosition = 'right';
  @Input() xAxis:any;
  @Input() yAxis:any;
  @Input() showXAxisLabel:any;
  @Input() showYAxisLabel:any;
  @Input() showRightYAxisLabel:any;
  @Input() xAxisLabel:any;
  @Input() yAxisLabel:any;
  @Input() yAxisLabelRight:any;
  @Input() tooltipDisabled = false;
  @Input() gradient!: boolean;
  @Input() showGridLines = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType!: string;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() yRightAxisTickFormatting: any;
  @Input() roundDomains = false;
  @Input()
  colorSchemeLine!: any[];
  @Input() autoScale:any;
  @Input() lineChart: any;
  @Input() yLeftAxisScaleFactor: any;
  @Input() yRightAxisScaleFactor: any;
  @Input() rangeFillOpacity!: number;
  @Input() animations = true;
  @Input() noBarWhenZero = true;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate', { static: false })
  tooltipTemplate!: TemplateRef<any>;
  @ContentChild('seriesTooltipTemplate', { static: false })
  seriesTooltipTemplate!: TemplateRef<any>;

  @ViewChild(LineSeriesComponent, { static: false })
  lineSeriesComponent!: LineSeriesComponent;

  dims!: ViewDimensions;
  xScale: any;
  yScale: any;
  xDomain: any;
  yDomain: any;
  transform!: string;
  colors!: ColorHelper;
  colorsLine!: ColorHelper;
  margin: any[] = [10, 20, 10, 20];
  xAxisHeight = 0;
  yAxisWidth = 0;
  legendOptions: any;
  scaleType = 'linear';
  xScaleLine:any;
  yScaleLine:any;
  xDomainLine:any;
  yDomainLine:any;
  seriesDomain:any;
  scaledAxis:any;
  combinedSeries:any;
  xSet:any;
  filteredDomain:any;
  hoveredVertical:any;
  yOrientLeft = 'left';
  yOrientRight = 'right';
  legendSpacing = 0;
  bandwidth:any;
  barPadding = 8;

  trackBy(index:number, item:any): string {
    return item.name;
  }

  update(): void {
    super.update();
    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.legend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });

    if (!this.yAxis) {
      this.legendSpacing = 0;
    } else if (this.showYAxisLabel && this.yAxis) {
      this.legendSpacing = 100;
    } else {
      this.legendSpacing = 40;
    }
    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    // line chart
    this.xDomainLine = this.getXDomainLine();
    if (this.filteredDomain) {
      this.xDomainLine = this.filteredDomain;
    }

    this.yDomainLine = this.getYDomainLine();
    this.seriesDomain = this.getSeriesDomain();

    this.scaleLines();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  deactivateAll() {
    this.activeEntries = [...this.activeEntries];
    for (const entry of this.activeEntries) {
      this.deactivate.emit({ value: entry, entries: [] });
    }
    this.activeEntries = [];
  }

  @HostListener('mouseleave')
  hideCircles(): void {
    this.hoveredVertical = null;
    this.deactivateAll();
  }

  updateHoveredVertical(item:any): void {
    this.hoveredVertical = item.value;
    this.deactivateAll();
  }

  updateDomain(domain:any): void {
    this.filteredDomain = domain;
    this.xDomainLine = this.filteredDomain;
    this.xScaleLine = this.getXScaleLine(this.xDomainLine, this.dims.width);
  }

  scaleLines() {
    this.xScaleLine = this.getXScaleLine(this.xDomainLine, this.dims.width);
    this.yScaleLine = this.getYScaleLine(this.yDomainLine, this.dims.height);
  }

  getSeriesDomain(): any[] {
    this.combinedSeries = this.lineChart.slice(0);
    this.combinedSeries.push({
      name: this.yAxisLabel,
      series: this.results
    });
    return this.combinedSeries.map((d:any) => d.name);
  }

  isDate(value:any) {
    if (value instanceof Date) {
      return true;
    }

    return false;
  }

  getScaleType(values:any) {
    let date = true;
    let num = true;

    for (const value of values) {
      if (!this.isDate(value)) {
        date = false;
      }

      if (typeof value !== 'number') {
        num = false;
      }
    }

    if (date) { return 'time'; }
    if (num) { return 'linear'; }
    return 'ordinal';
  }

  getXDomainLine(): any[] {
    let values:any = [];

    for (const results of this.lineChart) {
      for (const d of results.series) {
        if (!values.includes(d.name)) {
          values.push(d.name);
        }
      }
    }

    this.scaleType = this.getScaleType(values);
    let domain = [];

    if (this.scaleType === 'time') {
      const min = Math.min(...values);
      const max = Math.max(...values);
      domain = [min, max];
    } else if (this.scaleType === 'linear') {
      values = values.map((v:any) => Number(v));
      const min = Math.min(...values);
      const max = Math.max(...values);
      domain = [min, max];
    } else {
      domain = values;
    }

    this.xSet = values;
    return domain;
  }

  getYDomainLine(): any[] {
    const domain = [];

    for (const results of this.lineChart) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
        if (d.min !== undefined) {
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }

    let min = Math.min(...domain);
    const max = Math.max(...domain);
    if (this.yRightAxisScaleFactor) {
      const minMax = this.yRightAxisScaleFactor(min, max);
      return [Math.min(0, minMax.min), minMax.max];
    } else {
      min = Math.min(0, min);
      return [min, max];
    }
  }

  getXScaleLine(domain:any, width:any) {
    let scale;
    if (this.bandwidth === undefined) {
      this.bandwidth = width - this.barPadding;
    }
    const offset = Math.floor((width + this.barPadding - (this.bandwidth + this.barPadding) * domain.length) / 2);

    if (this.scaleType === 'time') {
      scale = scaleTime()
        .range([0, width])
        .domain(domain);
    } else if (this.scaleType === 'linear') {
      scale = scaleLinear()
        .range([0, width])
        .domain(domain);

      if (this.roundDomains) {
        scale = scale.nice();
      }
    } else if (this.scaleType === 'ordinal') {
      scale = scalePoint()
        .range([offset + this.bandwidth / 2, width - offset - this.bandwidth / 2])
        .domain(domain);
    }

    return scale;
  }

  getYScaleLine(domain:any, height:any) {
    const scale = scaleLinear()
      .range([height, 0])
      .domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  getXScale(): any {
    this.xDomain = this.getXDomain();
    const spacing = this.xDomain.length / (this.dims.width / this.barPadding + 1);
    return scaleBand()
      .range([0, this.dims.width])
      .paddingInner(spacing)
      .domain(this.xDomain);
  }

  getYScale(): any {
    this.yDomain = this.getYDomain();
    const scale = scaleLinear()
      .range([this.dims.height, 0])
      .domain(this.yDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getXDomain(): any[] {
    return this.results.map((d:any) => d.name);
  }

  getYDomain() {
    const values = this.results.map((d:any) => d.value);
    const min = Math.min(0, ...values);
    const max = Math.max(...values);
    if (this.yLeftAxisScaleFactor) {
      const minMax = this.yLeftAxisScaleFactor(min, max);
      return [Math.min(0, minMax.min), minMax.max];
    } else {
      return [min, max];
    }
  }

  onClick(data:any) {
    this.select.emit(data);
  }

  setColors(): void {
    let domain;
    if (this.schemeType === 'ordinal') {
      domain = this.xDomain;
    } else {
      domain = this.yDomain;
    }
    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    this.colorsLine = new ColorHelper(this.colorSchemeLine, this.schemeType, domain, this.customColors);
  }

  getLegendOptions() {
    const opts :any= {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === 'ordinal') {
      opts.domain = this.seriesDomain;
      opts.colors = this.colorsLine;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.seriesDomain;
      opts.colors = this.colors.scale;
    }
    return opts;
  }

  updateLineWidth(width:number) {
    this.bandwidth = width;
    this.scaleLines();
  }

  updateYAxisWidth({ width }:any) {
    this.yAxisWidth = width + 20;
    this.update();
  }

  updateXAxisHeight({ height }:any) {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(item:any) {
    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item:any) {
    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }
}
