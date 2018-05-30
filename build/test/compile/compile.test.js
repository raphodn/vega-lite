"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../src/log");
var compile_1 = require("../../src/compile/compile");
describe('compile/compile', function () {
    it('should throw error for invalid spec', function () {
        chai_1.assert.throws(function () {
            compile_1.compile({});
        }, Error, log.message.INVALID_SPEC);
    });
    it('should return a spec with default top-level properties, size signals, data, marks, and title', function () {
        var spec = compile_1.compile({
            "data": {
                "values": [{ "a": "A", "b": 28 }]
            },
            "title": { "text": "test" },
            "mark": "point",
            "encoding": {}
        }).spec;
        chai_1.assert.equal(spec.padding, 5);
        chai_1.assert.equal(spec.autosize, 'pad');
        chai_1.assert.equal(spec.width, 21);
        chai_1.assert.equal(spec.height, 21);
        chai_1.assert.deepEqual(spec.title, { text: 'test' });
        chai_1.assert.equal(spec.data.length, 1); // just source
        chai_1.assert.equal(spec.marks.length, 1); // just the root group
    });
    it('should return a spec with specified top-level properties, size signals, data and marks', function () {
        var spec = compile_1.compile({
            "padding": 123,
            "data": {
                "values": [{ "a": "A", "b": 28 }]
            },
            "mark": "point",
            "encoding": {}
        }).spec;
        chai_1.assert.equal(spec.padding, 123);
        chai_1.assert.equal(spec.autosize, 'pad');
        chai_1.assert.equal(spec.width, 21);
        chai_1.assert.equal(spec.height, 21);
        chai_1.assert.equal(spec.data.length, 1); // just source.
        chai_1.assert.equal(spec.marks.length, 1); // just the root group
    });
    it('should use size signal for bar chart width', function () {
        var spec = compile_1.compile({
            "data": { "values": [{ "a": "A", "b": 28 }] },
            "mark": "bar",
            "encoding": {
                "x": { "field": "a", "type": "ordinal" },
                "y": { "field": "b", "type": "quantitative" }
            }
        }).spec;
        chai_1.assert.deepEqual(spec.signals, [{
                name: 'x_step',
                value: 21
            }, {
                name: 'width',
                update: "bandspace(domain('x').length, 0.1, 0.05) * x_step"
            }]);
        chai_1.assert.equal(spec.height, 200);
    });
    it('should set resize to true if requested', function () {
        var spec = compile_1.compile({
            "autosize": {
                "resize": true
            },
            "data": { "url": "foo.csv" },
            "mark": "point",
            "encoding": {}
        }).spec;
        chai_1.assert(spec.autosize.resize);
    });
    it('should set autosize to fit and containment if requested', function () {
        var spec = compile_1.compile({
            "autosize": {
                "type": "fit",
                "contains": "content"
            },
            "data": { "url": "foo.csv" },
            "mark": "point",
            "encoding": {}
        }).spec;
        chai_1.assert.deepEqual(spec.autosize, { type: 'fit', contains: 'content' });
    });
    it('should set autosize to fit if requested', function () {
        var spec = compile_1.compile({
            "autosize": "fit",
            "data": { "url": "foo.csv" },
            "mark": "point",
            "encoding": {}
        }).spec;
        chai_1.assert.equal(spec.autosize, "fit");
    });
    it('warn if size is data driven and autosize is fit', log.wrap(function (localLogger) {
        var spec = compile_1.compile({
            "data": { "values": [{ "a": "A", "b": 28 }] },
            "mark": "bar",
            "autosize": "fit",
            "encoding": {
                "x": { "field": "a", "type": "ordinal" },
                "y": { "field": "b", "type": "quantitative" }
            }
        }).spec;
        chai_1.assert.equal(localLogger.warns[0], log.message.CANNOT_FIX_RANGE_STEP_WITH_FIT);
        chai_1.assert.equal(spec.width, 200);
        chai_1.assert.equal(spec.height, 200);
    }));
    it('warn if trying to fit composed spec', log.wrap(function (localLogger) {
        var spec = compile_1.compile({
            "data": { "values": [{ "a": "A", "b": 28 }] },
            "autosize": "fit",
            "vconcat": [{
                    "mark": "point",
                    "encoding": {}
                }]
        }).spec;
        chai_1.assert.equal(localLogger.warns[0], log.message.FIT_NON_SINGLE);
        chai_1.assert.equal(spec.autosize, 'pad');
    }));
    it('should return title for a layered spec.', function () {
        var spec = compile_1.compile({
            "data": {
                "values": [{ "a": "A", "b": 28 }]
            },
            "title": { "text": "test" },
            "layer": [{
                    "mark": "point",
                    "encoding": {}
                }]
        }).spec;
        chai_1.assert.deepEqual(spec.title, { text: 'test' });
    });
    it('should return title (string) for a layered spec.', function () {
        var spec = compile_1.compile({
            "data": {
                "values": [{ "a": "A", "b": 28 }]
            },
            "title": "test",
            "layer": [{
                    "mark": "point",
                    "encoding": {}
                }]
        }).spec;
        chai_1.assert.deepEqual(spec.title, { text: 'test' });
    });
    it('should return title from a child of a layer spec if parent has no title.', function () {
        var spec = compile_1.compile({
            "data": {
                "values": [{ "a": "A", "b": 28 }]
            },
            "layer": [{
                    "title": { "text": "test" },
                    "mark": "point",
                    "encoding": {}
                }]
        }).spec;
        chai_1.assert.deepEqual(spec.title, { text: 'test' });
    });
    it('should return a title for a concat spec, throw warning if anchor is set to other values than "start" and automatically set anchor to "start".', log.wrap(function (localLogger) {
        var spec = compile_1.compile({
            "data": {
                "values": [{ "a": "A", "b": 28 }]
            },
            "title": { "text": "test" },
            "hconcat": [{
                    "mark": "point",
                    "encoding": {}
                }],
            "config": { "title": { "anchor": "middle" } }
        }).spec;
        chai_1.assert.deepEqual(spec.title, {
            text: 'test',
            anchor: 'start' // We only support anchor as start for concat
        });
        chai_1.assert.equal(localLogger.warns[0], log.message.cannotSetTitleAnchor('concat'));
    }));
    it('should return a title for a concat spec, automatically set anchor to "start", and augment the title with non-mark title config (e.g., offset).', function () {
        var spec = compile_1.compile({
            "data": {
                "values": [{ "a": "A", "b": 28 }]
            },
            "title": { "text": "test" },
            "hconcat": [{
                    "mark": "point",
                    "encoding": {}
                }],
            "config": { "title": { "offset": 5 } }
        }).spec;
        chai_1.assert.deepEqual(spec.title, {
            text: 'test',
            anchor: 'start',
            offset: 5
        });
    });
    it('should not have title if there is no title.', function () {
        var spec = compile_1.compile({
            "data": {
                "values": [{ "a": "A", "b": 28 }]
            },
            "hconcat": [{
                    "mark": "point",
                    "encoding": {}
                }],
            "config": { "title": { "offset": 5 } }
        }).spec;
        chai_1.assert.isUndefined(spec.title);
    });
    it('should use provided config.', function () {
        var spec = compile_1.compile({
            mark: "point",
            data: { url: "foo.csv" },
            encoding: {}
        }, { config: {
                background: "blue"
            } }).spec;
        chai_1.assert.equal(spec.config.background, "blue");
    });
    it('should merge spec and provided config.', function () {
        var spec = compile_1.compile({
            mark: "point",
            data: { url: "foo.csv" },
            encoding: {},
            config: {
                background: "red"
            }
        }, { config: {
                background: "blue"
            } }).spec;
        chai_1.assert.equal(spec.config.background, "red");
    });
    it('should return a spec with projections (implicit)', function () {
        var spec = compile_1.compile({
            "mark": "geoshape",
            "data": {
                "url": "data/us-10m.json",
                "format": {
                    "type": "topojson",
                    "feature": "states"
                }
            },
            "encoding": {}
        }).spec;
        chai_1.assert.isDefined(spec.projections);
    });
    it('should return a spec with projections (explicit)', function () {
        var spec = compile_1.compile({
            "mark": "geoshape",
            "projection": {
                "type": "albersUsa"
            },
            "data": {
                "url": "data/us-10m.json",
                "format": {
                    "type": "topojson",
                    "feature": "states"
                }
            },
            "encoding": {}
        }).spec;
        chai_1.assert.isDefined(spec.projections);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsbUNBQXFDO0FBRXJDLHFEQUFrRDtBQUdsRCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLGFBQU0sQ0FBQyxNQUFNLENBQUM7WUFDWixpQkFBTyxDQUFDLEVBQVMsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4RkFBOEYsRUFBRTtRQUNqRyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2FBQy9CO1lBQ0QsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQztZQUN6QixNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVSLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QixhQUFNLENBQUMsU0FBUyxD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QUM7WUFDbkIsTUFBTSxFQUFFLFVBQVU7WUFDbEIsWUFBWSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxXQUFXO2FBQ3BCO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxrQkFBa0I7Z0JBQ3pCLFFBQVEsRUFBRTtvQkFDUixNQUFNLEVBQUUsVUFBVTtvQkFDbEIsU0FBUyxFQUFFLFFBQVE7aUJBQ3BCO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsRUFBRTtTQUNmLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDUixhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL3NyYy9sb2cnO1xuXG5pbXBvcnQge2NvbXBpbGV9IGZyb20gJy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUnO1xuXG5cbmRlc2NyaWJlKCdjb21waWxlL2NvbXBpbGUnLCBmdW5jdGlvbigpIHtcbiAgaXQoJ3Nob3VsZCB0aHJvdyBlcnJvciBmb3IgaW52YWxpZCBzcGVjJywgKCkgPT4ge1xuICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgY29tcGlsZSh7fSBhcyBhbnkpO1xuICAgIH0sIEVycm9yLCBsb2cubWVzc2FnZS5JTlZBTElEX1NQRUMpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHNwZWMgd2l0aCBkZWZhdWx0IHRvcC1sZXZlbCBwcm9wZXJ0aWVzLCBzaXplIHNpZ25hbHMsIGRhdGEsIG1hcmtzLCBhbmQgdGl0bGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcInRpdGxlXCI6IHtcInRleHRcIjogXCJ0ZXN0XCJ9LFxuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICB9KS5zcGVjO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMucGFkZGluZywgNSk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuYXV0b3NpemUsICdwYWQnKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy53aWR0aCwgMjEpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmhlaWdodCwgMjEpO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge3RleHQ6ICd0ZXN0J30pO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuZGF0YS5sZW5ndGgsIDEpOyAvLyBqdXN0IHNvdXJjZVxuICAgIGFzc2VydC5lcXVhbChzcGVjLm1hcmtzLmxlbmd0aCwgMSk7IC8vIGp1c3QgdGhlIHJvb3QgZ3JvdXBcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzcGVjIHdpdGggc3BlY2lmaWVkIHRvcC1sZXZlbCBwcm9wZXJ0aWVzLCBzaXplIHNpZ25hbHMsIGRhdGEgYW5kIG1hcmtzJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwicGFkZGluZ1wiOiAxMjMsXG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydC5lcXVhbChzcGVjLnBhZGRpbmcsIDEyMyk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuYXV0b3NpemUsICdwYWQnKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy53aWR0aCwgMjEpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmhlaWdodCwgMjEpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuZGF0YS5sZW5ndGgsIDEpOyAvLyBqdXN0IHNvdXJjZS5cbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5tYXJrcy5sZW5ndGgsIDEpOyAvLyBqdXN0IHRoZSByb290IGdyb3VwXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdXNlIHNpemUgc2lnbmFsIGZvciBiYXIgY2hhcnQgd2lkdGgnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XX0sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy5zaWduYWxzLCBbe1xuICAgICAgbmFtZTogJ3hfc3RlcCcsXG4gICAgICB2YWx1ZTogMjFcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnd2lkdGgnLFxuICAgICAgdXBkYXRlOiBgYmFuZHNwYWNlKGRvbWFpbigneCcpLmxlbmd0aCwgMC4xLCAwLjA1KSAqIHhfc3RlcGBcbiAgICB9XSk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuaGVpZ2h0LCAyMDApO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNldCByZXNpemUgdG8gdHJ1ZSBpZiByZXF1ZXN0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJhdXRvc2l6ZVwiOiB7XG4gICAgICAgIFwicmVzaXplXCI6IHRydWVcbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZm9vLmNzdlwifSxcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydChzcGVjLmF1dG9zaXplLnJlc2l6ZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2V0IGF1dG9zaXplIHRvIGZpdCBhbmQgY29udGFpbm1lbnQgaWYgcmVxdWVzdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiYXV0b3NpemVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJmaXRcIixcbiAgICAgICAgXCJjb250YWluc1wiOiBcImNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJmb28uY3N2XCJ9LFxuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICB9KS5zcGVjO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLmF1dG9zaXplLCB7dHlwZTogJ2ZpdCcsIGNvbnRhaW5zOiAnY29udGVudCd9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgYXV0b3NpemUgdG8gZml0IGlmIHJlcXVlc3RlZCcsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImF1dG9zaXplXCI6IFwiZml0XCIsXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZm9vLmNzdlwifSxcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydC5lcXVhbChzcGVjLmF1dG9zaXplLCBcImZpdFwiKTtcbiAgfSk7XG5cbiAgaXQoJ3dhcm4gaWYgc2l6ZSBpcyBkYXRhIGRyaXZlbiBhbmQgYXV0b3NpemUgaXMgZml0JywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XX0sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiYXV0b3NpemVcIjogXCJmaXRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLkNBTk5PVF9GSVhfUkFOR0VfU1RFUF9XSVRIX0ZJVCk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMud2lkdGgsIDIwMCk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuaGVpZ2h0LCAyMDApO1xuICB9KSk7XG5cbiAgaXQoJ3dhcm4gaWYgdHJ5aW5nIHRvIGZpdCBjb21wb3NlZCBzcGVjJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XX0sXG4gICAgICBcImF1dG9zaXplXCI6IFwiZml0XCIsXG4gICAgICBcInZjb25jYXRcIjogW3tcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuRklUX05PTl9TSU5HTEUpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmF1dG9zaXplLCAncGFkJyk7XG4gIH0pKTtcblxuICBpdCgnc2hvdWxkIHJldHVybiB0aXRsZSBmb3IgYSBsYXllcmVkIHNwZWMuJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgIFwibGF5ZXJcIjogW3tcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge3RleHQ6ICd0ZXN0J30pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiB0aXRsZSAoc3RyaW5nKSBmb3IgYSBsYXllcmVkIHNwZWMuJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJ0aXRsZVwiOiBcInRlc3RcIixcbiAgICAgIFwibGF5ZXJcIjogW3tcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge3RleHQ6ICd0ZXN0J30pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiB0aXRsZSBmcm9tIGEgY2hpbGQgb2YgYSBsYXllciBzcGVjIGlmIHBhcmVudCBoYXMgbm8gdGl0bGUuJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJsYXllclwiOiBbe1xuICAgICAgICBcInRpdGxlXCI6IHtcInRleHRcIjogXCJ0ZXN0XCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9XVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnRpdGxlLCB7dGV4dDogJ3Rlc3QnfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgdGl0bGUgZm9yIGEgY29uY2F0IHNwZWMsIHRocm93IHdhcm5pbmcgaWYgYW5jaG9yIGlzIHNldCB0byBvdGhlciB2YWx1ZXMgdGhhbiBcInN0YXJ0XCIgYW5kIGF1dG9tYXRpY2FsbHkgc2V0IGFuY2hvciB0byBcInN0YXJ0XCIuJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcInRpdGxlXCI6IHtcInRleHRcIjogXCJ0ZXN0XCJ9LFxuICAgICAgXCJoY29uY2F0XCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dLFxuICAgICAgXCJjb25maWdcIjoge1widGl0bGVcIjoge1wiYW5jaG9yXCI6IFwibWlkZGxlXCJ9fVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnRpdGxlLCB7XG4gICAgICB0ZXh0OiAndGVzdCcsXG4gICAgICBhbmNob3I6ICdzdGFydCcgLy8gV2Ugb25seSBzdXBwb3J0IGFuY2hvciBhcyBzdGFydCBmb3IgY29uY2F0XG4gICAgfSk7XG4gICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5jYW5ub3RTZXRUaXRsZUFuY2hvcignY29uY2F0JykpO1xuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSB0aXRsZSBmb3IgYSBjb25jYXQgc3BlYywgYXV0b21hdGljYWxseSBzZXQgYW5jaG9yIHRvIFwic3RhcnRcIiwgYW5kIGF1Z21lbnQgdGhlIHRpdGxlIHdpdGggbm9uLW1hcmsgdGl0bGUgY29uZmlnIChlLmcuLCBvZmZzZXQpLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwidGl0bGVcIjoge1widGV4dFwiOiBcInRlc3RcIn0sXG4gICAgICBcImhjb25jYXRcIjogW3tcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJ0aXRsZVwiOiB7XCJvZmZzZXRcIjogNX19XG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHtcbiAgICAgIHRleHQ6ICd0ZXN0JyxcbiAgICAgIGFuY2hvcjogJ3N0YXJ0JyxcbiAgICAgIG9mZnNldDogNVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG5vdCBoYXZlIHRpdGxlIGlmIHRoZXJlIGlzIG5vIHRpdGxlLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwiaGNvbmNhdFwiOiBbe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9XSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInRpdGxlXCI6IHtcIm9mZnNldFwiOiA1fX1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5pc1VuZGVmaW5lZChzcGVjLnRpdGxlKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2UgcHJvdmlkZWQgY29uZmlnLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICBkYXRhOiB7dXJsOiBcImZvby5jc3ZcIn0sXG4gICAgICBlbmNvZGluZzoge31cbiAgICB9LCB7Y29uZmlnOiB7XG4gICAgICBiYWNrZ3JvdW5kOiBcImJsdWVcIlxuICAgIH19KS5zcGVjO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmNvbmZpZy5iYWNrZ3JvdW5kLCBcImJsdWVcIik7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbWVyZ2Ugc3BlYyBhbmQgcHJvdmlkZWQgY29uZmlnLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICBkYXRhOiB7dXJsOiBcImZvby5jc3ZcIn0sXG4gICAgICBlbmNvZGluZzoge30sXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgYmFja2dyb3VuZDogXCJyZWRcIlxuICAgICAgfVxuICAgIH0sIHtjb25maWc6IHtcbiAgICAgIGJhY2tncm91bmQ6IFwiYmx1ZVwiXG4gICAgfX0pLnNwZWM7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuY29uZmlnLmJhY2tncm91bmQsIFwicmVkXCIpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHNwZWMgd2l0aCBwcm9qZWN0aW9ucyAoaW1wbGljaXQpJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcInRvcG9qc29uXCIsXG4gICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5pc0RlZmluZWQoc3BlYy5wcm9qZWN0aW9ucyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgc3BlYyB3aXRoIHByb2plY3Rpb25zIChleHBsaWNpdCknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuaXNEZWZpbmVkKHNwZWMucHJvamVjdGlvbnMpO1xuICB9KTtcbn0pO1xuIl19