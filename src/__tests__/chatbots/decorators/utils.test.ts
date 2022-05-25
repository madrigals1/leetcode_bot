/* eslint-disable camelcase */
import {
  getArgs, getPositionalParsedArguments,
} from '../../../chatbots/decorators/utils';
import { ArgumentMessages } from '../../../globals/messages';
import { ArgumentsError, InputError } from '../../../utils/errors';
import { ArgumentTestCase } from '../../__mocks__/models';
import { generateMockContext } from '../../__mocks__/utils.mock';

describe('chatbots.decorators.utils - getArgs function', () => {
  test('Correct case - Only command with no arguments', async () => {
    expect(getArgs('/action')).toStrictEqual([]);
  });

  test('Correct case - Slash command', async () => {
    expect(getArgs('/action Random action with Args'))
      .toStrictEqual(['Random', 'action', 'with', 'Args']);
  });

  test('Correct case - Exclamation mark command', async () => {
    expect(getArgs('!action wow here')).toStrictEqual(['wow', 'here']);
  });

  test('Correct case - No prefix command', async () => {
    expect(getArgs('any words with separator'))
      .toStrictEqual(['words', 'with', 'separator']);
  });
});

describe('chatbots.decorators.utils - getParsedArguments function', () => {
  const test1: ArgumentTestCase = {
    name: 'Requested empty args, provided empty args',
    input: {
      providedArgs: [],
      requestedArgs: undefined,
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: undefined,
  };

  const test2: ArgumentTestCase = {
    name: 'Requested 1 optional arg, provided 1 arg',
    input: {
      providedArgs: ['tc2_value'],
      requestedArgs: [
        {
          key: 'tc2_argument1',
          name: 'tc2_Argument1',
          index: 0,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc2_argument1: {
          index: 0,
          key: 'tc2_argument1',
          name: 'tc2_Argument1',
          _value: 'tc2_value',
        },
      },
      byIndex: {
        0: {
          index: 0,
          key: 'tc2_argument1',
          name: 'tc2_Argument1',
          _value: 'tc2_value',
        },
      },
    },
    error: undefined,
  };

  const test3: ArgumentTestCase = {
    name: 'Requested 1 required arg, provided 1 arg',
    input: {
      providedArgs: ['tc3_value'],
      requestedArgs: [
        {
          key: 'tc3_argument1',
          name: 'tc3_Argument1',
          index: 0,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {
        tc3_argument1: {
          index: 0,
          key: 'tc3_argument1',
          name: 'tc3_Argument1',
          _value: 'tc3_value',
        },
      },
      byIndex: {
        0: {
          index: 0,
          key: 'tc3_argument1',
          name: 'tc3_Argument1',
          _value: 'tc3_value',
        },
      },
    },
    error: undefined,
  };

  const test4: ArgumentTestCase = {
    name: 'Requested 1 optional arg, provided empty args',
    input: {
      providedArgs: [],
      requestedArgs: [
        {
          key: 'tc4_argument1',
          name: 'tc4_Argument1',
          index: 0,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc4_argument1: {
          key: 'tc4_argument1',
          name: 'tc4_Argument1',
          index: 0,
          _value: '',
        },
      },
      byIndex: {
        0: {
          key: 'tc4_argument1',
          name: 'tc4_Argument1',
          index: 0,
          _value: '',
        },
      },
    },
    error: undefined,
  };

  const test5: ArgumentTestCase = {
    name: 'Requested 1 required multi arg, provided 1 multi arg (3 elems)',
    input: {
      providedArgs: ['tc5_value1', 'tc5_value2', 'tc5_value3'],
      requestedArgs: [
        {
          key: 'tc5_argument1',
          name: 'tc5_Argument1',
          index: 0,
          isMultiple: true,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {
        tc5_argument1: {
          key: 'tc5_argument1',
          name: 'tc5_Argument1',
          index: 0,
          _value: ['tc5_value1', 'tc5_value2', 'tc5_value3'],
        },
      },
      byIndex: {
        0: {
          key: 'tc5_argument1',
          name: 'tc5_Argument1',
          index: 0,
          _value: ['tc5_value1', 'tc5_value2', 'tc5_value3'],
        },
      },
    },
    error: undefined,
  };

  const test6: ArgumentTestCase = {
    name: 'Requested 1 optional multi arg, provided 1 multi arg (3 elems)',
    input: {
      providedArgs: ['tc6_value1', 'tc6_value2', 'tc6_value3'],
      requestedArgs: [
        {
          key: 'tc6_argument1',
          name: 'tc6_Argument1',
          index: 0,
          isMultiple: true,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc6_argument1: {
          key: 'tc6_argument1',
          name: 'tc6_Argument1',
          index: 0,
          _value: ['tc6_value1', 'tc6_value2', 'tc6_value3'],
        },
      },
      byIndex: {
        0: {
          key: 'tc6_argument1',
          name: 'tc6_Argument1',
          index: 0,
          _value: ['tc6_value1', 'tc6_value2', 'tc6_value3'],
        },
      },
    },
    error: undefined,
  };

  const test7: ArgumentTestCase = {
    name: 'Requested 1 optional multi arg, provided empty args',
    input: {
      providedArgs: [],
      requestedArgs: [
        {
          key: 'tc6_argument1',
          name: 'tc6_Argument1',
          index: 0,
          isMultiple: true,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc6_argument1: {
          key: 'tc6_argument1',
          name: 'tc6_Argument1',
          index: 0,
          _value: [],
        },
      },
      byIndex: {
        0: {
          key: 'tc6_argument1',
          name: 'tc6_Argument1',
          index: 0,
          _value: [],
        },
      },
    },
    error: undefined,
  };

  const test8: ArgumentTestCase = {
    name: 'Requested 1 required multi arg, provided 1 multi arg (1 elems)',
    input: {
      providedArgs: ['tc8_value1'],
      requestedArgs: [
        {
          key: 'tc8_argument1',
          name: 'tc8_Argument1',
          index: 0,
          isMultiple: true,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {
        tc8_argument1: {
          key: 'tc8_argument1',
          name: 'tc8_Argument1',
          index: 0,
          _value: ['tc8_value1'],
        },
      },
      byIndex: {
        0: {
          key: 'tc8_argument1',
          name: 'tc8_Argument1',
          index: 0,
          _value: ['tc8_value1'],
        },
      },
    },
    error: undefined,
  };

  const test9: ArgumentTestCase = {
    name: 'Requested 1 required multi arg, provided 1 multi arg (8 elems)',
    input: {
      providedArgs: [
        'tc9_value1',
        'tc9_value2',
        'tc9_value3',
        'tc9_value4',
        'tc9_value5',
        'tc9_value6',
        'tc9_value7',
        'tc9_value8',
      ],
      requestedArgs: [
        {
          key: 'tc9_argument1',
          name: 'tc9_Argument1',
          index: 0,
          isMultiple: true,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {
        tc9_argument1: {
          key: 'tc9_argument1',
          name: 'tc9_Argument1',
          index: 0,
          _value: [
            'tc9_value1',
            'tc9_value2',
            'tc9_value3',
            'tc9_value4',
            'tc9_value5',
            'tc9_value6',
            'tc9_value7',
            'tc9_value8',
          ],
        },
      },
      byIndex: {
        0: {
          key: 'tc9_argument1',
          name: 'tc9_Argument1',
          index: 0,
          _value: [
            'tc9_value1',
            'tc9_value2',
            'tc9_value3',
            'tc9_value4',
            'tc9_value5',
            'tc9_value6',
            'tc9_value7',
            'tc9_value8',
          ],
        },
      },
    },
    error: undefined,
  };

  const test10: ArgumentTestCase = {
    name: 'Requested 2 required arg, provided 2 arg',
    input: {
      providedArgs: ['tc10_value1', 'tc10_value2'],
      requestedArgs: [
        {
          key: 'tc10_argument1',
          name: 'tc10_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc10_argument2',
          name: 'tc10_Argument2',
          index: 1,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {
        tc10_argument1: {
          key: 'tc10_argument1',
          name: 'tc10_Argument1',
          index: 0,
          _value: 'tc10_value1',
        },
        tc10_argument2: {
          key: 'tc10_argument2',
          name: 'tc10_Argument2',
          index: 1,
          _value: 'tc10_value2',
        },
      },
      byIndex: {
        0: {
          key: 'tc10_argument1',
          name: 'tc10_Argument1',
          index: 0,
          _value: 'tc10_value1',
        },
        1: {
          key: 'tc10_argument2',
          name: 'tc10_Argument2',
          index: 1,
          _value: 'tc10_value2',
        },
      },
    },
    error: undefined,
  };

  const test11: ArgumentTestCase = {
    name: 'Requested 2 optional arg, provided 2 arg',
    input: {
      providedArgs: ['tc11_value1', 'tc11_value2'],
      requestedArgs: [
        {
          key: 'tc11_argument1',
          name: 'tc11_Argument1',
          index: 0,
          isRequired: false,
        },
        {
          key: 'tc11_argument2',
          name: 'tc11_Argument2',
          index: 1,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc11_argument1: {
          key: 'tc11_argument1',
          name: 'tc11_Argument1',
          index: 0,
          _value: 'tc11_value1',
        },
        tc11_argument2: {
          key: 'tc11_argument2',
          name: 'tc11_Argument2',
          index: 1,
          _value: 'tc11_value2',
        },
      },
      byIndex: {
        0: {
          key: 'tc11_argument1',
          name: 'tc11_Argument1',
          index: 0,
          _value: 'tc11_value1',
        },
        1: {
          key: 'tc11_argument2',
          name: 'tc11_Argument2',
          index: 1,
          _value: 'tc11_value2',
        },
      },
    },
    error: undefined,
  };

  const test12: ArgumentTestCase = {
    name: 'Requested 1 required, 1 optional, provided 2 arg',
    input: {
      providedArgs: ['tc12_value1', 'tc12_value2'],
      requestedArgs: [
        {
          key: 'tc12_argument1',
          name: 'tc12_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc12_argument2',
          name: 'tc12_Argument2',
          index: 1,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc12_argument1: {
          key: 'tc12_argument1',
          name: 'tc12_Argument1',
          index: 0,
          _value: 'tc12_value1',
        },
        tc12_argument2: {
          key: 'tc12_argument2',
          name: 'tc12_Argument2',
          index: 1,
          _value: 'tc12_value2',
        },
      },
      byIndex: {
        0: {
          key: 'tc12_argument1',
          name: 'tc12_Argument1',
          index: 0,
          _value: 'tc12_value1',
        },
        1: {
          key: 'tc12_argument2',
          name: 'tc12_Argument2',
          index: 1,
          _value: 'tc12_value2',
        },
      },
    },
    error: undefined,
  };

  const test13: ArgumentTestCase = {
    name: 'Requested 5 required arg, provided 5 arg',
    input: {
      providedArgs: [
        'tc13_value1',
        'tc13_value2',
        'tc13_value3',
        'tc13_value4',
        'tc13_value5',
      ],
      requestedArgs: [
        {
          key: 'tc13_argument1',
          name: 'tc13_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc13_argument2',
          name: 'tc13_Argument2',
          index: 1,
          isRequired: true,
        },
        {
          key: 'tc13_argument3',
          name: 'tc13_Argument3',
          index: 2,
          isRequired: true,
        },
        {
          key: 'tc13_argument4',
          name: 'tc13_Argument4',
          index: 3,
          isRequired: true,
        },
        {
          key: 'tc13_argument5',
          name: 'tc13_Argument5',
          index: 4,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {
        tc13_argument1: {
          key: 'tc13_argument1',
          name: 'tc13_Argument1',
          index: 0,
          _value: 'tc13_value1',
        },
        tc13_argument2: {
          key: 'tc13_argument2',
          name: 'tc13_Argument2',
          index: 1,
          _value: 'tc13_value2',
        },
        tc13_argument3: {
          key: 'tc13_argument3',
          name: 'tc13_Argument3',
          index: 2,
          _value: 'tc13_value3',
        },
        tc13_argument4: {
          key: 'tc13_argument4',
          name: 'tc13_Argument4',
          index: 3,
          _value: 'tc13_value4',
        },
        tc13_argument5: {
          key: 'tc13_argument5',
          name: 'tc13_Argument5',
          index: 4,
          _value: 'tc13_value5',
        },
      },
      byIndex: {
        0: {
          key: 'tc13_argument1',
          name: 'tc13_Argument1',
          index: 0,
          _value: 'tc13_value1',
        },
        1: {
          key: 'tc13_argument2',
          name: 'tc13_Argument2',
          index: 1,
          _value: 'tc13_value2',
        },
        2: {
          key: 'tc13_argument3',
          name: 'tc13_Argument3',
          index: 2,
          _value: 'tc13_value3',
        },
        3: {
          key: 'tc13_argument4',
          name: 'tc13_Argument4',
          index: 3,
          _value: 'tc13_value4',
        },
        4: {
          key: 'tc13_argument5',
          name: 'tc13_Argument5',
          index: 4,
          _value: 'tc13_value5',
        },
      },
    },
    error: undefined,
  };

  const test14: ArgumentTestCase = {
    name: 'Requested 3 required arg, 2 optional org, provided 5 arg',
    input: {
      providedArgs: [
        'tc14_value1',
        'tc14_value2',
        'tc14_value3',
        'tc14_value4',
        'tc14_value5',
      ],
      requestedArgs: [
        {
          key: 'tc14_argument1',
          name: 'tc14_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc14_argument2',
          name: 'tc14_Argument2',
          index: 1,
          isRequired: true,
        },
        {
          key: 'tc14_argument3',
          name: 'tc14_Argument3',
          index: 2,
          isRequired: true,
        },
        {
          key: 'tc14_argument4',
          name: 'tc14_Argument4',
          index: 3,
          isRequired: false,
        },
        {
          key: 'tc14_argument5',
          name: 'tc14_Argument5',
          index: 4,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc14_argument1: {
          key: 'tc14_argument1',
          name: 'tc14_Argument1',
          index: 0,
          _value: 'tc14_value1',
        },
        tc14_argument2: {
          key: 'tc14_argument2',
          name: 'tc14_Argument2',
          index: 1,
          _value: 'tc14_value2',
        },
        tc14_argument3: {
          key: 'tc14_argument3',
          name: 'tc14_Argument3',
          index: 2,
          _value: 'tc14_value3',
        },
        tc14_argument4: {
          key: 'tc14_argument4',
          name: 'tc14_Argument4',
          index: 3,
          _value: 'tc14_value4',
        },
        tc14_argument5: {
          key: 'tc14_argument5',
          name: 'tc14_Argument5',
          index: 4,
          _value: 'tc14_value5',
        },
      },
      byIndex: {
        0: {
          key: 'tc14_argument1',
          name: 'tc14_Argument1',
          index: 0,
          _value: 'tc14_value1',
        },
        1: {
          key: 'tc14_argument2',
          name: 'tc14_Argument2',
          index: 1,
          _value: 'tc14_value2',
        },
        2: {
          key: 'tc14_argument3',
          name: 'tc14_Argument3',
          index: 2,
          _value: 'tc14_value3',
        },
        3: {
          key: 'tc14_argument4',
          name: 'tc14_Argument4',
          index: 3,
          _value: 'tc14_value4',
        },
        4: {
          key: 'tc14_argument5',
          name: 'tc14_Argument5',
          index: 4,
          _value: 'tc14_value5',
        },
      },
    },
    error: undefined,
  };

  const test15: ArgumentTestCase = {
    name: 'Requested 3 required arg, 2 optional org, provided 4 arg',
    input: {
      providedArgs: [
        'tc15_value1',
        'tc15_value2',
        'tc15_value3',
        'tc15_value4',
      ],
      requestedArgs: [
        {
          key: 'tc15_argument1',
          name: 'tc15_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc15_argument2',
          name: 'tc15_Argument2',
          index: 1,
          isRequired: true,
        },
        {
          key: 'tc15_argument3',
          name: 'tc15_Argument3',
          index: 2,
          isRequired: true,
        },
        {
          key: 'tc15_argument4',
          name: 'tc15_Argument4',
          index: 3,
          isRequired: false,
        },
        {
          key: 'tc15_argument5',
          name: 'tc15_Argument5',
          index: 4,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc15_argument1: {
          key: 'tc15_argument1',
          name: 'tc15_Argument1',
          index: 0,
          _value: 'tc15_value1',
        },
        tc15_argument2: {
          key: 'tc15_argument2',
          name: 'tc15_Argument2',
          index: 1,
          _value: 'tc15_value2',
        },
        tc15_argument3: {
          key: 'tc15_argument3',
          name: 'tc15_Argument3',
          index: 2,
          _value: 'tc15_value3',
        },
        tc15_argument4: {
          key: 'tc15_argument4',
          name: 'tc15_Argument4',
          index: 3,
          _value: 'tc15_value4',
        },
        tc15_argument5: {
          key: 'tc15_argument5',
          name: 'tc15_Argument5',
          index: 4,
          _value: '',
        },
      },
      byIndex: {
        0: {
          key: 'tc15_argument1',
          name: 'tc15_Argument1',
          index: 0,
          _value: 'tc15_value1',
        },
        1: {
          key: 'tc15_argument2',
          name: 'tc15_Argument2',
          index: 1,
          _value: 'tc15_value2',
        },
        2: {
          key: 'tc15_argument3',
          name: 'tc15_Argument3',
          index: 2,
          _value: 'tc15_value3',
        },
        3: {
          key: 'tc15_argument4',
          name: 'tc15_Argument4',
          index: 3,
          _value: 'tc15_value4',
        },
        4: {
          key: 'tc15_argument5',
          name: 'tc15_Argument5',
          index: 4,
          _value: '',
        },
      },
    },
    error: undefined,
  };

  const test16: ArgumentTestCase = {
    name: 'Requested 3 required arg, 2 optional org, provided 4 arg',
    input: {
      providedArgs: [
        'tc16_value1',
        'tc16_value2',
        'tc16_value3',
      ],
      requestedArgs: [
        {
          key: 'tc16_argument1',
          name: 'tc16_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc16_argument2',
          name: 'tc16_Argument2',
          index: 1,
          isRequired: true,
        },
        {
          key: 'tc16_argument3',
          name: 'tc16_Argument3',
          index: 2,
          isRequired: true,
        },
        {
          key: 'tc16_argument4',
          name: 'tc16_Argument4',
          index: 3,
          isRequired: false,
        },
        {
          key: 'tc16_argument5',
          name: 'tc16_Argument5',
          index: 4,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc16_argument1: {
          key: 'tc16_argument1',
          name: 'tc16_Argument1',
          index: 0,
          _value: 'tc16_value1',
        },
        tc16_argument2: {
          key: 'tc16_argument2',
          name: 'tc16_Argument2',
          index: 1,
          _value: 'tc16_value2',
        },
        tc16_argument3: {
          key: 'tc16_argument3',
          name: 'tc16_Argument3',
          index: 2,
          _value: 'tc16_value3',
        },
        tc16_argument4: {
          key: 'tc16_argument4',
          name: 'tc16_Argument4',
          index: 3,
          _value: '',
        },
        tc16_argument5: {
          key: 'tc16_argument5',
          name: 'tc16_Argument5',
          index: 4,
          _value: '',
        },
      },
      byIndex: {
        0: {
          key: 'tc16_argument1',
          name: 'tc16_Argument1',
          index: 0,
          _value: 'tc16_value1',
        },
        1: {
          key: 'tc16_argument2',
          name: 'tc16_Argument2',
          index: 1,
          _value: 'tc16_value2',
        },
        2: {
          key: 'tc16_argument3',
          name: 'tc16_Argument3',
          index: 2,
          _value: 'tc16_value3',
        },
        3: {
          key: 'tc16_argument4',
          name: 'tc16_Argument4',
          index: 3,
          _value: '',
        },
        4: {
          key: 'tc16_argument5',
          name: 'tc16_Argument5',
          index: 4,
          _value: '',
        },
      },
    },
    error: undefined,
  };

  const test17: ArgumentTestCase = {
    name: 'Requested 1 required multi arg, 1 required org, provided 1 multi arg'
      + ' (3 elems), 1 arg',
    input: {
      providedArgs: [
        'tc17_value1',
        'tc17_value2',
        'tc17_value3',
        'tc17_value4',
      ],
      requestedArgs: [
        {
          key: 'tc17_argument1',
          name: 'tc17_Argument1',
          index: 0,
          isMultiple: true,
          isRequired: true,
        },
        {
          key: 'tc17_argument2',
          name: 'tc17_Argument2',
          index: 3,
          isMultiple: false,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {
        tc17_argument1: {
          key: 'tc17_argument1',
          name: 'tc17_Argument1',
          index: 0,
          _value: ['tc17_value1', 'tc17_value2', 'tc17_value3'],
        },
        tc17_argument2: {
          key: 'tc17_argument2',
          name: 'tc17_Argument2',
          index: 3,
          _value: 'tc17_value4',
        },
      },
      byIndex: {
        0: {
          key: 'tc17_argument1',
          name: 'tc17_Argument1',
          index: 0,
          _value: ['tc17_value1', 'tc17_value2', 'tc17_value3'],
        },
        3: {
          key: 'tc17_argument2',
          name: 'tc17_Argument2',
          index: 3,
          _value: 'tc17_value4',
        },
      },
    },
    error: undefined,
  };

  const test18: ArgumentTestCase = {
    name: 'Requested 1 required arg, 1 required multi  org, provided 1 arg '
      + '1 multi arg (3 elems)',
    input: {
      providedArgs: [
        'tc18_value1',
        'tc18_value2',
        'tc18_value3',
        'tc18_value4',
      ],
      requestedArgs: [
        {
          key: 'tc18_argument1',
          name: 'tc18_Argument1',
          index: 0,
          isMultiple: false,
          isRequired: true,
        },
        {
          key: 'tc18_argument2',
          name: 'tc18_Argument2',
          index: 1,
          isMultiple: true,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {
        tc18_argument1: {
          key: 'tc18_argument1',
          name: 'tc18_Argument1',
          index: 0,
          _value: 'tc18_value1',
        },
        tc18_argument2: {
          key: 'tc18_argument2',
          name: 'tc18_Argument2',
          index: 1,
          _value: ['tc18_value2', 'tc18_value3', 'tc18_value4'],
        },
      },
      byIndex: {
        0: {
          key: 'tc18_argument1',
          name: 'tc18_Argument1',
          index: 0,
          _value: 'tc18_value1',
        },
        1: {
          key: 'tc18_argument2',
          name: 'tc18_Argument2',
          index: 1,
          _value: ['tc18_value2', 'tc18_value3', 'tc18_value4'],
        },
      },
    },
    error: undefined,
  };

  const test19: ArgumentTestCase = {
    name: `Requested:
    - 1 required arg
    - 1 required multi arg (3 elems)
    - 1 required arg
    - 1 optional multi arg (3 elems)
    - 1 optional arg
    - 1 optional mutli arg (3 elems)
    Provided: 12 args`,
    input: {
      providedArgs: [
        'tc19_value1',
        'tc19_value2',
        'tc19_value3',
        'tc19_value4',
        'tc19_value5',
        'tc19_value6',
        'tc19_value7',
        'tc19_value8',
        'tc19_value9',
        'tc19_value10',
        'tc19_value11',
        'tc19_value12',
      ],
      requestedArgs: [
        {
          key: 'tc19_argument1',
          name: 'tc19_Argument1',
          index: 0,
          isMultiple: false,
          isRequired: true,
        },
        {
          key: 'tc19_argument2',
          name: 'tc19_Argument2',
          index: 1,
          isMultiple: true,
          isRequired: true,
        },
        {
          key: 'tc19_argument3',
          name: 'tc19_Argument3',
          index: 4,
          isMultiple: false,
          isRequired: true,
        },
        {
          key: 'tc19_argument4',
          name: 'tc19_Argument4',
          index: 5,
          isMultiple: true,
          isRequired: false,
        },
        {
          key: 'tc19_argument5',
          name: 'tc19_Argument5',
          index: 8,
          isMultiple: false,
          isRequired: false,
        },
        {
          key: 'tc19_argument6',
          name: 'tc19_Argument6',
          index: 9,
          isMultiple: true,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc19_argument1: {
          key: 'tc19_argument1',
          name: 'tc19_Argument1',
          index: 0,
          _value: 'tc19_value1',
        },
        tc19_argument2: {
          key: 'tc19_argument2',
          name: 'tc19_Argument2',
          index: 1,
          _value: ['tc19_value2', 'tc19_value3', 'tc19_value4'],
        },
        tc19_argument3: {
          key: 'tc19_argument3',
          name: 'tc19_Argument3',
          index: 4,
          _value: 'tc19_value5',
        },
        tc19_argument4: {
          key: 'tc19_argument4',
          name: 'tc19_Argument4',
          index: 5,
          _value: ['tc19_value6', 'tc19_value7', 'tc19_value8'],
        },
        tc19_argument5: {
          key: 'tc19_argument5',
          name: 'tc19_Argument5',
          index: 8,
          _value: 'tc19_value9',
        },
        tc19_argument6: {
          key: 'tc19_argument6',
          name: 'tc19_Argument6',
          index: 9,
          _value: ['tc19_value10', 'tc19_value11', 'tc19_value12'],
        },
      },
      byIndex: {
        0: {
          key: 'tc19_argument1',
          name: 'tc19_Argument1',
          index: 0,
          _value: 'tc19_value1',
        },
        1: {
          key: 'tc19_argument2',
          name: 'tc19_Argument2',
          index: 1,
          _value: ['tc19_value2', 'tc19_value3', 'tc19_value4'],
        },
        4: {
          key: 'tc19_argument3',
          name: 'tc19_Argument3',
          index: 4,
          _value: 'tc19_value5',
        },
        5: {
          key: 'tc19_argument4',
          name: 'tc19_Argument4',
          index: 5,
          _value: ['tc19_value6', 'tc19_value7', 'tc19_value8'],
        },
        8: {
          key: 'tc19_argument5',
          name: 'tc19_Argument5',
          index: 8,
          _value: 'tc19_value9',
        },
        9: {
          key: 'tc19_argument6',
          name: 'tc19_Argument6',
          index: 9,
          _value: ['tc19_value10', 'tc19_value11', 'tc19_value12'],
        },
      },
    },
    error: undefined,
  };

  const test20: ArgumentTestCase = {
    name: `Requested:
    - 1 required arg
    - 1 required multi arg (3 elems)
    - 1 required arg
    - 1 optional multi arg (3 elems)
    - 1 optional arg
    - 1 optional mutli arg (3 elems)
    Provided: 7 args`,
    input: {
      providedArgs: [
        'tc20_value1',
        'tc20_value2',
        'tc20_value3',
        'tc20_value4',
        'tc20_value5',
        'tc20_value6',
        'tc20_value7',
      ],
      requestedArgs: [
        {
          key: 'tc20_argument1',
          name: 'tc20_Argument1',
          index: 0,
          isMultiple: false,
          isRequired: true,
        },
        {
          key: 'tc20_argument2',
          name: 'tc20_Argument2',
          index: 1,
          isMultiple: true,
          isRequired: true,
        },
        {
          key: 'tc20_argument3',
          name: 'tc20_Argument3',
          index: 4,
          isMultiple: false,
          isRequired: true,
        },
        {
          key: 'tc20_argument4',
          name: 'tc20_Argument4',
          index: 5,
          isMultiple: true,
          isRequired: false,
        },
        {
          key: 'tc20_argument5',
          name: 'tc20_Argument5',
          index: 8,
          isMultiple: false,
          isRequired: false,
        },
        {
          key: 'tc20_argument6',
          name: 'tc20_Argument6',
          index: 9,
          isMultiple: true,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {
        tc20_argument1: {
          key: 'tc20_argument1',
          name: 'tc20_Argument1',
          index: 0,
          _value: 'tc20_value1',
        },
        tc20_argument2: {
          key: 'tc20_argument2',
          name: 'tc20_Argument2',
          index: 1,
          _value: ['tc20_value2', 'tc20_value3', 'tc20_value4'],
        },
        tc20_argument3: {
          key: 'tc20_argument3',
          name: 'tc20_Argument3',
          index: 4,
          _value: 'tc20_value5',
        },
        tc20_argument4: {
          key: 'tc20_argument4',
          name: 'tc20_Argument4',
          index: 5,
          _value: ['tc20_value6', 'tc20_value7'],
        },
        tc20_argument5: {
          key: 'tc20_argument5',
          name: 'tc20_Argument5',
          index: 8,
          _value: '',
        },
        tc20_argument6: {
          key: 'tc20_argument6',
          name: 'tc20_Argument6',
          index: 9,
          _value: [],
        },
      },
      byIndex: {
        0: {
          key: 'tc20_argument1',
          name: 'tc20_Argument1',
          index: 0,
          _value: 'tc20_value1',
        },
        1: {
          key: 'tc20_argument2',
          name: 'tc20_Argument2',
          index: 1,
          _value: ['tc20_value2', 'tc20_value3', 'tc20_value4'],
        },
        4: {
          key: 'tc20_argument3',
          name: 'tc20_Argument3',
          index: 4,
          _value: 'tc20_value5',
        },
        5: {
          key: 'tc20_argument4',
          name: 'tc20_Argument4',
          index: 5,
          _value: ['tc20_value6', 'tc20_value7'],
        },
        8: {
          key: 'tc20_argument5',
          name: 'tc20_Argument5',
          index: 8,
          _value: '',
        },
        9: {
          key: 'tc20_argument6',
          name: 'tc20_Argument6',
          index: 9,
          _value: [],
        },
      },
    },
    error: undefined,
  };

  const test21: ArgumentTestCase = {
    name: 'Error: duplicate keys (single duplicate)',
    input: {
      providedArgs: [],
      requestedArgs: [
        {
          key: 'tc21_argument1',
          name: 'tc21_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc21_argument1',
          name: 'tc21_argument1',
          index: 1,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new ArgumentsError(
      ArgumentMessages.duplicateKeysInArgs(['tc21_argument1']),
    ),
  };

  const test22: ArgumentTestCase = {
    name: 'Error: duplicate keys (multiple duplicates)',
    input: {
      providedArgs: [],
      requestedArgs: [
        {
          key: 'tc22_argument1',
          name: 'tc22_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc22_argument1',
          name: 'tc22_argument1',
          index: 1,
          isRequired: true,
        },
        {
          key: 'tc22_argument2',
          name: 'tc22_Argument2',
          index: 2,
          isRequired: true,
        },
        {
          key: 'tc22_argument2',
          name: 'tc22_argument2',
          index: 3,
          isRequired: true,
        },
        {
          key: 'tc22_argument3',
          name: 'tc22_Argument3',
          index: 4,
          isRequired: true,
        },
        {
          key: 'tc22_argument3',
          name: 'tc22_argument3',
          index: 5,
          isRequired: true,
        },
        {
          key: 'tc22_argument4',
          name: 'tc22_argument4',
          index: 6,
          isRequired: true,
        },
        {
          key: 'tc22_argument5',
          name: 'tc22_argument5',
          index: 7,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new ArgumentsError(
      // eslint-disable-next-line max-len
      ArgumentMessages.duplicateKeysInArgs(['tc22_argument1', 'tc22_argument2', 'tc22_argument3']),
    ),
  };

  const test23: ArgumentTestCase = {
    name: 'Error: duplicate indexes (single duplicate)',
    input: {
      providedArgs: [],
      requestedArgs: [
        {
          key: 'tc23_argument1',
          name: 'tc23_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc23_argument2',
          name: 'tc23_argument2',
          index: 0,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new ArgumentsError(
      ArgumentMessages.duplicateIndexesInArgs([0]),
    ),
  };

  const test24: ArgumentTestCase = {
    name: 'Error: duplicate indexes (multiple duplicates)',
    input: {
      providedArgs: [],
      requestedArgs: [
        {
          key: 'tc24_argument1',
          name: 'tc24_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc24_argument2',
          name: 'tc24_argument2',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc24_argument3',
          name: 'tc24_Argument3',
          index: 1,
          isRequired: true,
        },
        {
          key: 'tc24_argument4',
          name: 'tc24_argument4',
          index: 1,
          isRequired: true,
        },
        {
          key: 'tc24_argument5',
          name: 'tc24_Argument5',
          index: 2,
          isRequired: true,
        },
        {
          key: 'tc24_argument6',
          name: 'tc24_argument6',
          index: 2,
          isRequired: true,
        },
        {
          key: 'tc24_argument7',
          name: 'tc24_argument7',
          index: 3,
          isRequired: true,
        },
        {
          key: 'tc24_argument8',
          name: 'tc24_argument8',
          index: 4,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new ArgumentsError(
      ArgumentMessages.duplicateIndexesInArgs([0, 1, 2]),
    ),
  };

  const test25: ArgumentTestCase = {
    name: 'Error: Insufficient arguments in message',
    input: {
      providedArgs: [],
      requestedArgs: [
        {
          key: 'tc25_argument1',
          name: 'tc25_Argument1',
          index: 5,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: Error(ArgumentMessages.insufficientArgsInMessage),
  };

  const test26: ArgumentTestCase = {
    name: 'Error: Should not request more than 100 arguments',
    input: {
      providedArgs: Array.from(Array(101).keys()).map((num) => `${num}`),
      requestedArgs: [
        {
          key: 'tc26_argument1',
          name: 'tc26_Argument1',
          index: 100,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new ArgumentsError(ArgumentMessages.shouldNotRequestMoreThan100Args),
  };

  const test27: ArgumentTestCase = {
    name: 'Error: Should not provide more than 100 arguments',
    input: {
      providedArgs: Array.from(Array(150).keys()).map((num) => `${num}`),
      requestedArgs: [
        {
          key: 'tc27_argument1',
          name: 'tc27_Argument1',
          index: 1,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new InputError(ArgumentMessages.shouldNotProvideMoreThan100Args),
  };

  const test28: ArgumentTestCase = {
    name: 'Error: Should not have required arguments after optional arguments',
    input: {
      providedArgs: ['tc28_value', 'tc28_value', 'tc28_value'],
      requestedArgs: [
        {
          key: 'tc28_argument1',
          name: 'tc28_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc28_argument2',
          name: 'tc28_Argument2',
          index: 1,
          isRequired: false,
        },
        {
          key: 'tc28_argument3',
          name: 'tc28_Argument3',
          index: 2,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new ArgumentsError(
      ArgumentMessages.shouldNotHaveRequiredArgsAfterOptional,
    ),
  };

  const test29: ArgumentTestCase = {
    name: 'Error: Message should not have any arguments',
    input: {
      providedArgs: ['tc29_value', 'tc29_value', 'tc29_value'],
      requestedArgs: [],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new InputError(ArgumentMessages.messageShouldHaveNoArgs),
  };

  const test30: ArgumentTestCase = {
    name: 'Error: Index `i` should be present in arguments',
    input: {
      providedArgs: ['tc30_value', 'tc30_value', 'tc30_value'],
      requestedArgs: [
        {
          key: 'tc30_argument1',
          name: 'tc30_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc30_argument2',
          name: 'tc30_Argument2',
          index: 2,
          isRequired: true,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new ArgumentsError(ArgumentMessages.indexShouldBePresentInArgs(1)),
  };

  const test31: ArgumentTestCase = {
    name: 'Error: Argument `notFoundIndex` is not provided',
    input: {
      providedArgs: ['tc31_value', 'tc31_value'],
      requestedArgs: [
        {
          key: 'tc31_argument1',
          name: 'tc31_Argument1',
          index: 0,
          isRequired: true,
        },
        {
          key: 'tc31_argument2',
          name: 'tc31_Argument2',
          index: 1,
          isRequired: true,
        },
        {
          key: 'tc31_argument3',
          name: 'tc31_Argument3',
          index: 2,
          isRequired: false,
        },
        {
          key: 'tc31_argument4',
          name: 'tc31_Argument4',
          index: 4,
          isRequired: false,
        },
      ],
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: new ArgumentsError(ArgumentMessages.argIsNotProvided(3)),
  };

  const test32: ArgumentTestCase = {
    name: 'Branches: requestedArgs can be null',
    input: {
      providedArgs: [],
      requestedArgs: null,
    },
    output: {
      byKey: {},
      byIndex: {},
    },
    error: undefined,
  };

  const testCases: ArgumentTestCase[] = [
    test1,
    test2,
    test3,
    test4,
    test5,
    test6,
    test7,
    test8,
    test9,
    test10,
    test11,
    test12,
    test13,
    test14,
    test15,
    test16,
    test17,
    test18,
    test19,
    test20,
    test21,
    test22,
    test23,
    test24,
    test25,
    test26,
    test27,
    test28,
    test29,
    test30,
    test31,
    test32,
  ];

  testCases.forEach(({
    name, input, output, error,
  }) => {
    test(name, async () => {
      const { providedArgs, requestedArgs } = input;

      // Add providedArgs to context
      const context = generateMockContext();
      context.text = `/fake_command ${providedArgs.join(' ')}`;

      if (error) {
        expect(() => getPositionalParsedArguments(context, requestedArgs))
          .toThrowError(error);
      } else {
        const { byKey, byIndex } = output;

        const argumentManager1 = (
          getPositionalParsedArguments(context, requestedArgs)
        );

        // Check by Key
        Object.entries(byKey).forEach(([key, argument]) => {
          expect(argumentManager1.pop(key)).toEqual(argument);
        });

        const argumentManager2 = (
          getPositionalParsedArguments(context, requestedArgs)
        );

        // Check by Index
        Object.entries(byIndex).forEach(([index, argument]) => {
          expect(argumentManager2.pop(Number(index))).toEqual(argument);
        });

        // Should not have any more arguments
        expect(argumentManager1.getAll()).toEqual([]);
        expect(argumentManager2.getAll()).toEqual([]);
      }
    });
  });
});
