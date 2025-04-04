import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { formatLabel } from '@swimlane/ngx-charts';

@Component({
    selector: 'g[ngx-combo-charts-series-vertical]',
    template: `
      <svg:g ngx-charts-bar *ngFor="let bar of bars; trackBy: trackBy"
        [@animationState]="'active'"
        [width]="bar.width"
        [height]="bar.height"
        [x]="bar.x"
        [y]="bar.y"
        [fill]="bar.color"
        [stops]="bar.gradientStops"
        [data]="bar.data"
        [orientation]="'vertical'"
        [roundEdges]="bar.roundEdges"
        [gradient]="gradient"
        [isActive]="isActive(bar.data)"
        [animations]="animations"
        [noBarWhenZero]="noBarWhenZero"
        (select)="onClick($event)"
        (activate)="activate.emit($event)"
        (deactivate)="deactivate.emit($event)"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="'top'"
        [tooltipType]="'tooltip'"
        [tooltipTitle]="bar.tooltipText">
      </svg:g>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('animationState', [
            transition('* => void', [
                style({
                    opacity: 1,
                    transform: '*',
                }),
                animate(500, style({ opacity: 0, transform: 'scale(0)' }))
            ])
        ])
    ]
})
export class ComboSeriesVerticalComponent implements OnChanges {

    @Input() dims:any;
    @Input() type = 'standard';
    @Input() series:any;
    @Input() seriesLine:any;
    @Input() xScale:any;
    @Input() yScale:any;
    @Input() colors:any;
    @Input() tooltipDisabled = false;
    @Input() gradient!: boolean;
    @Input() activeEntries!: any[];
    @Input() seriesName!: string;
    @Input() animations = true;
    @Input() noBarWhenZero = true;

    @Output() select = new EventEmitter();
    @Output() activate = new EventEmitter();
    @Output() deactivate = new EventEmitter();
    @Output() bandwidth = new EventEmitter();

    bars: any;
    x: any;
    y: any;

    ngOnChanges(changes:any): void {
        this.update();
    }

    update(): void {
        let width:any;
        if (this.series.length) {
            width = this.xScale.bandwidth();
            this.bandwidth.emit(width);
        }

        let d0 = 0;
        let total:any;
        if (this.type === 'normalized') {
            total = this.series.map((d:any) => d.value).reduce((sum:any, d:any) => sum + d, 0);
        }

        this.bars = this.series.map((d:any, index:any) => {

            let value = d.value;
            const label = d.name;
            const formattedLabel = formatLabel(label);
            const roundEdges = this.type === 'standard';

            const bar: any = {
                value,
                label,
                roundEdges,
                data: d,
                width,
                formattedLabel,
                height: 0,
                x: 0,
                y: 0
            };

            if (this.type === 'standard') {
                bar.height = Math.abs(this.yScale(value) - this.yScale(0));
                bar.x = this.xScale(label);

                if (value < 0) {
                    bar.y = this.yScale(0);
                } else {
                    bar.y = this.yScale(value);
                }
            } else if (this.type === 'stacked') {
                const offset0 = d0;
                const offset1 = offset0 + value;
                d0 += value;

                bar.height = this.yScale(offset0) - this.yScale(offset1);
                bar.x = 0;
                bar.y = this.yScale(offset1);
                bar.offset0 = offset0;
                bar.offset1 = offset1;
            } else if (this.type === 'normalized') {
                let offset0 = d0;
                let offset1 = offset0 + value;
                d0 += value;

                if (total > 0) {
                    offset0 = (offset0 * 100) / total;
                    offset1 = (offset1 * 100) / total;
                } else {
                    offset0 = 0;
                    offset1 = 0;
                }

                bar.height = this.yScale(offset0) - this.yScale(offset1);
                bar.x = 0;
                bar.y = this.yScale(offset1);
                bar.offset0 = offset0;
                bar.offset1 = offset1;
                value = (offset1 - offset0).toFixed(2) + '%';
            }

            if (this.colors.scaleType === 'ordinal') {
                bar.color = this.colors.getColor(label);
            } else {
                if (this.type === 'standard') {
                    bar.color = this.colors.getColor(value);
                    bar.gradientStops = this.colors.getLinearGradientStops(value);
                } else {
                    bar.color = this.colors.getColor(bar.offset1);
                    bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
                }
            }

            let tooltipLabel = formattedLabel;
            if (this.seriesName) {
                tooltipLabel = `${this.seriesName} • ${formattedLabel}`;
            }

            this.getSeriesTooltips(this.seriesLine, index);
            const lineValue = this.seriesLine[0].series[index].value;
            const lineName = this.seriesLine[0].series[index].name;
            bar.tooltipText = `
          <span class="tooltip-label">${tooltipLabel}</span>
          <span class="tooltip-val"> Y1 - ${value} • Y2 - ${lineValue}%</span>
        `;

            return bar;
        });
    }
    getSeriesTooltips(seriesLine:any, index:any) {
        return seriesLine.map((d:any) => {
            return d.series[index];
        });
    }
    isActive(entry:any): boolean {
        if (!this.activeEntries) { return false; }
        const item = this.activeEntries.find(d => {
            return entry.name === d.name && entry.series === d.series;
        });
        return item !== undefined;
    }

    onClick(data:any): void {
        this.select.emit(data);
    }

    trackBy(index:any, bar:any): string {
        return bar.label;
    }

}
