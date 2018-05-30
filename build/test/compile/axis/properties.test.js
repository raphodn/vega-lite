"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var properties = require("../../../src/compile/axis/properties");
var util_1 = require("../../util");
describe('compile/axis', function () {
    describe('grid()', function () {
        it('should return true by default for continuous scale that is not binned', function () {
            var grid = properties.grid('linear', { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(grid, true);
        });
        it('should return false by default for binned field', function () {
            var grid = properties.grid('linear', { bin: true, field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(grid, false);
        });
        it('should return false by default for a discrete scale', function () {
            var grid = properties.grid('point', { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(grid, false);
        });
    });
    describe('orient()', function () {
        it('should return bottom for x by default', function () {
            var orient = properties.orient('x');
            chai_1.assert.deepEqual(orient, 'bottom');
        });
        it('should return left for y by default', function () {
            var orient = properties.orient('y');
            chai_1.assert.deepEqual(orient, 'left');
        });
    });
    describe('tickCount', function () {
        it('should return undefined by default for a binned field', function () {
            var tickCount = properties.tickCount('x', { bin: { maxbins: 10 }, field: 'a', type: 'quantitative' }, 'linear', { signal: 'a' });
            chai_1.assert.deepEqual(tickCount, { signal: 'ceil(a/20)' });
        });
        var _loop_1 = function (timeUnit) {
            it("should return undefined by default for a temporal field with timeUnit=" + timeUnit, function () {
                var tickCount = properties.tickCount('x', { timeUnit: timeUnit, field: 'a', type: 'temporal' }, 'linear', { signal: 'a' });
                chai_1.assert.isUndefined(tickCount);
            });
        };
        for (var _i = 0, _a = ['month', 'hours', 'day', 'quarter']; _i < _a.length; _i++) {
            var timeUnit = _a[_i];
            _loop_1(timeUnit);
        }
        it('should return size/40 by default for linear scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'linear', { signal: 'a' });
            chai_1.assert.deepEqual(tickCount, { signal: 'ceil(a/40)' });
        });
        it('should return undefined by default for log scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'log', undefined);
            chai_1.assert.deepEqual(tickCount, undefined);
        });
        it('should return undefined by default for point scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'point', undefined);
            chai_1.assert.deepEqual(tickCount, undefined);
        });
    });
    describe('title()', function () {
        it('should add return fieldTitle by default', function () {
            var title = properties.title(3, { field: 'a', type: "quantitative" }, {});
            chai_1.assert.deepEqual(title, 'a');
        });
        it('should add return fieldTitle by default', function () {
            var title = properties.title(10, { aggregate: 'sum', field: 'a', type: "quantitative" }, {});
            chai_1.assert.deepEqual(title, 'Sum of a');
        });
        it('should add return fieldTitle by default and truncate', function () {
            var title = properties.title(3, { aggregate: 'sum', field: 'a', type: "quantitative" }, {});
            chai_1.assert.deepEqual(title, 'Su…');
        });
    });
    describe('values', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, null, null, "x");
            chai_1.assert.deepEqual(values, [
                { "signal": "datetime(1970, 0, 1, 0, 0, 0, 0)" },
                { "signal": "datetime(1980, 0, 1, 0, 0, 0, 0)" }
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, null, null, "x");
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
        it('should simply drop values when domain is specified', function () {
            var model1 = util_1.parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "y": {
                        "type": "quantitative",
                        "field": 'US_Gross',
                        "scale": { "domain": [-1, 2] },
                        "bin": { "extent": [0, 1] }
                    }
                },
                "data": { "url": "data/movies.json" }
            });
            var values = properties.values({}, model1, model1.fieldDef("y"), "y");
            chai_1.assert.deepEqual(values, undefined);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2F4aXMvcHJvcGVydGllcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixpRUFBbUU7QUFFbkUsbUNBQW1EO0FBRW5ELFFBQVEsQ0FBQyxjQUFjLEVBQUU7SUFDdkIsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsdUVBQXVFLEVBQUU7WUFDMUUsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDO1lBQzNFLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBQ3BELElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDO1lBQ3RGLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO1lBQ3hELElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQztZQUMxRSxhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxD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QyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRXhFLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgKiBhcyBwcm9wZXJ0aWVzIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcyc7XG5pbXBvcnQge1RpbWVVbml0fSBmcm9tICcuLi8uLi8uLi9zcmMvdGltZXVuaXQnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2F4aXMnLCAoKT0+IHtcbiAgZGVzY3JpYmUoJ2dyaWQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGJ5IGRlZmF1bHQgZm9yIGNvbnRpbnVvdXMgc2NhbGUgdGhhdCBpcyBub3QgYmlubmVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZ3JpZCA9IHByb3BlcnRpZXMuZ3JpZCgnbGluZWFyJywge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGdyaWQsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgYnkgZGVmYXVsdCBmb3IgYmlubmVkIGZpZWxkJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZ3JpZCA9IHByb3BlcnRpZXMuZ3JpZCgnbGluZWFyJywge2JpbjogdHJ1ZSwgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ3JpZCwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgYnkgZGVmYXVsdCBmb3IgYSBkaXNjcmV0ZSBzY2FsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGdyaWQgPSBwcm9wZXJ0aWVzLmdyaWQoJ3BvaW50Jywge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGdyaWQsIGZhbHNlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ29yaWVudCgpJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGJvdHRvbSBmb3IgeCBieSBkZWZhdWx0JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3Qgb3JpZW50ID0gcHJvcGVydGllcy5vcmllbnQoJ3gnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3JpZW50LCAnYm90dG9tJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBsZWZ0IGZvciB5IGJ5IGRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBvcmllbnQgPSBwcm9wZXJ0aWVzLm9yaWVudCgneScpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvcmllbnQsICdsZWZ0Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd0aWNrQ291bnQnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgYnkgZGVmYXVsdCBmb3IgYSBiaW5uZWQgZmllbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0aWNrQ291bnQgPSBwcm9wZXJ0aWVzLnRpY2tDb3VudCgneCcsIHtiaW46IHttYXhiaW5zOiAxMH0sIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgJ2xpbmVhcicsIHtzaWduYWwgOiAnYSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodGlja0NvdW50LCB7c2lnbmFsOiAnY2VpbChhLzIwKSd9KTtcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3QgdGltZVVuaXQgb2YgWydtb250aCcsICdob3VycycsICdkYXknLCAncXVhcnRlciddIGFzIFRpbWVVbml0W10pIHtcbiAgICAgICAgaXQoYHNob3VsZCByZXR1cm4gdW5kZWZpbmVkIGJ5IGRlZmF1bHQgZm9yIGEgdGVtcG9yYWwgZmllbGQgd2l0aCB0aW1lVW5pdD0ke3RpbWVVbml0fWAsICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0aWNrQ291bnQgPSBwcm9wZXJ0aWVzLnRpY2tDb3VudCgneCcsIHt0aW1lVW5pdCwgZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJ30sICdsaW5lYXInLCB7c2lnbmFsIDogJ2EnfSk7XG4gICAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHRpY2tDb3VudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHNpemUvNDAgYnkgZGVmYXVsdCBmb3IgbGluZWFyIHNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdGlja0NvdW50ID0gcHJvcGVydGllcy50aWNrQ291bnQoJ3gnLCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCAnbGluZWFyJywge3NpZ25hbCA6ICdhJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0aWNrQ291bnQsIHtzaWduYWw6ICdjZWlsKGEvNDApJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGJ5IGRlZmF1bHQgZm9yIGxvZyBzY2FsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHRpY2tDb3VudCA9IHByb3BlcnRpZXMudGlja0NvdW50KCd4Jywge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgJ2xvZycsIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHRpY2tDb3VudCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBieSBkZWZhdWx0IGZvciBwb2ludCBzY2FsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHRpY2tDb3VudCA9IHByb3BlcnRpZXMudGlja0NvdW50KCd4Jywge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgJ3BvaW50JywgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodGlja0NvdW50LCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndGl0bGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGFkZCByZXR1cm4gZmllbGRUaXRsZSBieSBkZWZhdWx0JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgdGl0bGUgPSBwcm9wZXJ0aWVzLnRpdGxlKDMsIHtmaWVsZDogJ2EnLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSwge30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0aXRsZSwgJ2EnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIHJldHVybiBmaWVsZFRpdGxlIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCB0aXRsZSA9IHByb3BlcnRpZXMudGl0bGUoMTAsIHthZ2dyZWdhdGU6ICdzdW0nLCBmaWVsZDogJ2EnLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSwge30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0aXRsZSwgJ1N1bSBvZiBhJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCByZXR1cm4gZmllbGRUaXRsZSBieSBkZWZhdWx0IGFuZCB0cnVuY2F0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHRpdGxlID0gcHJvcGVydGllcy50aXRsZSgzLCB7YWdncmVnYXRlOiAnc3VtJywgZmllbGQ6ICdhJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sIHt9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodGl0bGUsICdTdeKApicpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmFsdWVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGltZXN0YW1wIHZhbHVlcyBmb3IgRGF0ZVRpbWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWVzID0gcHJvcGVydGllcy52YWx1ZXMoe3ZhbHVlczogW3t5ZWFyOiAxOTcwfSwge3llYXI6IDE5ODB9XX0sIG51bGwsIG51bGwsIFwieFwiKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh2YWx1ZXMsIFtcbiAgICAgICAge1wic2lnbmFsXCI6IFwiZGF0ZXRpbWUoMTk3MCwgMCwgMSwgMCwgMCwgMCwgMClcIn0sXG4gICAgICAgIHtcInNpZ25hbFwiOiBcImRhdGV0aW1lKDE5ODAsIDAsIDEsIDAsIDAsIDAsIDApXCJ9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2ltcGx5IHJldHVybiB2YWx1ZXMgZm9yIG5vbi1EYXRlVGltZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHByb3BlcnRpZXMudmFsdWVzKHt2YWx1ZXM6IFsxLDIsMyw0XX0sIG51bGwsIG51bGwsIFwieFwiKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh2YWx1ZXMsIFsxLDIsMyw0XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNpbXBseSBkcm9wIHZhbHVlcyB3aGVuIGRvbWFpbiBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbDEgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6ICdVU19Hcm9zcycsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcImRvbWFpblwiOlstMSwyXX0sXG4gICAgICAgICAgICBcImJpblwiOiB7XCJleHRlbnRcIjpbMCwxXX1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHByb3BlcnRpZXMudmFsdWVzKHt9LCBtb2RlbDEsIG1vZGVsMS5maWVsZERlZihcInlcIiksIFwieVwiKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh2YWx1ZXMsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=