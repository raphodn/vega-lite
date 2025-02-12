import {compile} from '../../src/compile/compile';
import * as log from '../../src/log';

describe('compile/compile', () => {
  it('should throw error for invalid spec', () => {
    expect(() => {
      compile({} as any);
    }).toThrow();
  });

  it('should return a spec with default top-level properties, size signals, data, marks, and title', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: {text: 'test'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.padding).toEqual(5);
    expect(spec.autosize).toBeUndefined();
    expect(spec.width).toEqual(20);
    expect(spec.height).toEqual(20);
    expect(spec.title).toEqual({text: 'test', frame: 'group'});

    expect(spec.data.length).toEqual(1); // just source
    expect(spec.marks.length).toEqual(1); // just the root group
  });

  it('should return a spec with specified top-level properties, size signals, data and marks', () => {
    const spec = compile({
      padding: 123,
      data: {
        values: [{a: 'A', b: 28}]
      },
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.padding).toEqual(123);
    expect(spec.autosize).toBeUndefined();
    expect(spec.width).toEqual(20);
    expect(spec.height).toEqual(20);

    expect(spec.data.length).toEqual(1); // just source.
    expect(spec.marks.length).toEqual(1); // just the root group
  });

  it(
    'should drop fit in top-level properties for discrete x discrete chart',
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 'foo', y: 'bar'}]
        },
        autosize: 'fit',
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'nominal'},
          y: {field: 'y', type: 'nominal'}
        }
      }).spec;

      expect(localLogger.warns[0]).toEqual(log.message.droppingFit());
      expect(spec.autosize).toBeUndefined();
    })
  );

  it(
    'should drop fit-y in top-level properties for quantitative x discrete chart',
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 1, y: 'bar'}]
        },
        autosize: 'fit',
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'quantitative'},
          y: {field: 'y', type: 'nominal'}
        }
      }).spec;

      expect(localLogger.warns[0]).toEqual(log.message.droppingFit('y'));
      expect(spec.autosize).toBe('fit-x');
    })
  );

  it(
    'should drop fit-x in top-level properties for discrete x quantitative chart',
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 'foo', y: 1}]
        },
        autosize: 'fit',
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'nominal'},
          y: {field: 'y', type: 'quantitative'}
        }
      }).spec;

      expect(localLogger.warns[0]).toEqual(log.message.droppingFit('x'));
      expect(spec.autosize).toBe('fit-y');
    })
  );

  it(
    'should NOT drop fit in top-level properties for specified width/height chart',
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 'foo', y: 'bar'}]
        },
        autosize: 'fit',
        width: 400,
        height: 400,
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'nominal'},
          y: {field: 'y', type: 'nominal'}
        }
      }).spec;

      expect(localLogger.warns.length).toEqual(0);
      expect(spec.autosize).toBe('fit');
    })
  );

  it(
    'should NOT drop fit-y in top-level properties for specified height chart',
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 1, y: 'bar'}]
        },
        height: 400,
        autosize: 'fit',
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'quantitative'},
          y: {field: 'y', type: 'nominal'}
        }
      }).spec;

      expect(localLogger.warns.length).toEqual(0);
      expect(spec.autosize).toBe('fit');
    })
  );

  it(
    'should NOT drop fit-x in top-level properties for specified width chart',
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 'foo', y: 1}]
        },
        width: 400,
        autosize: 'fit',
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'nominal'},
          y: {field: 'y', type: 'quantitative'}
        }
      }).spec;

      expect(localLogger.warns.length).toEqual(0);
      expect(spec.autosize).toBe('fit');
    })
  );

  it('should use size signal for bar chart width', () => {
    const spec = compile({
      data: {values: [{a: 'A', b: 28}]},
      mark: 'bar',
      encoding: {
        x: {field: 'a', type: 'ordinal'},
        y: {field: 'b', type: 'quantitative'}
      }
    }).spec;

    expect(spec.signals).toEqual([
      {
        name: 'x_step',
        value: 20
      },
      {
        name: 'width',
        update: `bandspace(domain('x').length, 0.1, 0.05) * x_step`
      }
    ]);
    expect(spec.height).toEqual(200);
  });

  it('should set resize to true if requested', () => {
    const spec = compile({
      autosize: {
        resize: true
      },
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect((spec.autosize as any).resize).toBeTruthy();
  });

  it('should set autosize to fit and containment if requested', () => {
    const spec = compile({
      autosize: {
        type: 'fit',
        contains: 'content'
      },
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.autosize).toEqual({type: 'fit', contains: 'content'});
  });

  it('should set autosize to fit if requested', () => {
    const spec = compile({
      autosize: 'fit',
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.autosize).toBe('fit');
  });

  it('should use containerSize for width and autosize to fit-x/padding', () => {
    const spec = compile({
      width: 'container',
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.autosize).toEqual({type: 'fit-x', contains: 'padding'});
    expect(spec.signals).toEqual([
      {
        name: 'width',
        init: 'isFinite(containerSize()[0]) ? containerSize()[0] : 200',
        on: [{events: 'window:resize', update: 'isFinite(containerSize()[0]) ? containerSize()[0] : 200'}]
      }
    ]);
    expect(spec.width).toBeUndefined();
  });

  it('should use containerSize for width and autosize to fit-y/padding', () => {
    const spec = compile({
      height: 'container',
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.autosize).toEqual({type: 'fit-y', contains: 'padding'});
    expect(spec.signals).toEqual([
      {
        name: 'height',
        init: 'isFinite(containerSize()[1]) ? containerSize()[1] : 200',
        on: [{events: 'window:resize', update: 'isFinite(containerSize()[1]) ? containerSize()[1] : 200'}]
      }
    ]);
    expect(spec.height).toBeUndefined();
  });

  it('should use containerSize for width/height and autosize to fit/padding, and respect default view width/height', () => {
    const spec = compile({
      width: 'container',
      height: 'container',
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {},
      config: {
        view: {
          continuousWidth: 500,
          continuousHeight: 300
        }
      }
    }).spec;

    expect(spec.autosize).toEqual({type: 'fit', contains: 'padding'});
    expect(spec.signals).toEqual([
      {
        name: 'width',
        init: 'isFinite(containerSize()[0]) ? containerSize()[0] : 500',
        on: [{events: 'window:resize', update: 'isFinite(containerSize()[0]) ? containerSize()[0] : 500'}]
      },
      {
        name: 'height',
        init: 'isFinite(containerSize()[1]) ? containerSize()[1] : 300',
        on: [{events: 'window:resize', update: 'isFinite(containerSize()[1]) ? containerSize()[1] : 300'}]
      }
    ]);
    expect(spec.width).toBeUndefined();
    expect(spec.height).toBeUndefined();
  });

  it(
    'warn if use container for width and pad for autosize',
    log.wrap(localLogger => {
      compile({
        width: 'container',
        height: 'container',
        autosize: 'pad',
        data: {url: 'foo.csv'},
        mark: 'point',
        encoding: {}
      });
      expect(localLogger.warns[0]).toEqual(log.message.containerSizeNotCompatibleWithAutosize('width'));
      expect(localLogger.warns[1]).toEqual(log.message.containerSizeNotCompatibleWithAutosize('height'));
    })
  );

  it(
    'warn if use container for width for composed spec',
    log.wrap(localLogger => {
      const spec = compile({
        width: 'container',
        vconcat: [
          {
            mark: 'point',
            encoding: {}
          }
        ]
      }).spec;
      expect(localLogger.warns[0]).toEqual(log.message.containerSizeNonSingle('width'));
      expect(spec.autosize).toBeUndefined();
    })
  );

  it(
    'warn if use container for height for composed spec',
    log.wrap(localLogger => {
      const spec = compile({
        height: 'container',
        vconcat: [
          {
            mark: 'point',
            encoding: {}
          }
        ]
      }).spec;
      expect(localLogger.warns[0]).toEqual(log.message.containerSizeNonSingle('height'));
      expect(spec.autosize).toBeUndefined();
    })
  );

  it(
    'warn if trying to fit composed spec',
    log.wrap(localLogger => {
      const spec = compile({
        data: {values: [{a: 'A', b: 28}]},
        autosize: 'fit',
        vconcat: [
          {
            mark: 'point',
            encoding: {}
          }
        ]
      }).spec;
      expect(localLogger.warns[0]).toEqual(log.message.FIT_NON_SINGLE);
      expect(spec.autosize).toBeUndefined();
    })
  );

  it('should return title for a layered spec.', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: {text: 'test'},
      layer: [
        {
          mark: 'point',
          encoding: {}
        }
      ]
    }).spec;
    expect(spec.title).toEqual({text: 'test', frame: 'group'});
  });

  it('should return title (string) for a layered spec.', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: 'test',
      layer: [
        {
          mark: 'point',
          encoding: {}
        }
      ]
    }).spec;
    expect(spec.title).toEqual({text: 'test', frame: 'group'});
  });

  it('should return title from a child of a layer spec if parent has no title.', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      layer: [
        {
          title: {text: 'test'},
          mark: 'point',
          encoding: {}
        }
      ]
    }).spec;
    expect(spec.title).toEqual({text: 'test', frame: 'group'});
  });

  it('should return a title for a concat spec', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: {text: 'test'},
      hconcat: [
        {
          mark: 'point',
          encoding: {}
        }
      ],
      config: {title: {anchor: 'middle'}}
    }).spec;
    expect(spec.title).toEqual({
      text: 'test',
      anchor: 'middle' // We only support anchor as start for concat
    });
  });

  it('should return a title for a concat spec, automatically set anchor to "start", and augment the title with non-mark title config (e.g., offset).', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: {text: 'test'},
      hconcat: [
        {
          mark: 'point',
          encoding: {}
        }
      ],
      config: {title: {offset: 5}}
    }).spec;
    expect(spec.title).toEqual({
      text: 'test',
      anchor: 'start',
      offset: 5
    });
  });

  it('should not have title if there is no title.', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      hconcat: [
        {
          mark: 'point',
          encoding: {}
        }
      ],
      config: {title: {offset: 5}}
    }).spec;
    expect(spec.title).not.toBeDefined();
  });

  it('should use provided config.', () => {
    const spec = compile(
      {
        mark: 'point',
        data: {url: 'foo.csv'},
        encoding: {}
      },
      {
        config: {
          background: 'blue'
        }
      }
    ).spec;
    expect(spec.background).toBe('blue');
  });

  it('should merge spec and provided config.', () => {
    const spec = compile(
      {
        mark: 'point',
        data: {url: 'foo.csv'},
        encoding: {},
        config: {
          background: 'red'
        }
      },
      {
        config: {
          background: 'blue'
        }
      }
    ).spec;
    expect(spec.background).toBe('red');
  });

  it('should return a spec with projections (implicit)', () => {
    const spec = compile({
      mark: 'geoshape',
      data: {
        url: 'data/us-10m.json',
        format: {
          type: 'topojson',
          feature: 'states'
        }
      },
      encoding: {}
    }).spec;
    expect(spec.projections).toBeDefined();
  });

  it('should return a spec with projections (explicit)', () => {
    const spec = compile({
      mark: 'geoshape',
      projection: {
        type: 'albersUsa'
      },
      data: {
        url: 'data/us-10m.json',
        format: {
          type: 'topojson',
          feature: 'states'
        }
      },
      encoding: {}
    }).spec;
    expect(spec.projections).toBeDefined();
  });
});
