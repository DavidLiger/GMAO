<?php

namespace App\Library\Enum;

enum EnumTypeChamp: string
{

    case TEXT = 'text';

    case NUMBER = 'number';

    case DATE = 'date';

    case DATETIME = 'datetime';

    case SELECT = 'select';

    case RADIO = 'radio';

    case CHECKBOX = 'checkbox';

    case CHECKBOX_LIST = 'checkbox_list';

    case MONTH = 'month';
}