package com.theshipboard.assembler;

import com.theshipboard.catalog.DeviceCategory;
import com.theshipboard.intent.IntentModel;

public interface CodeAssembler {
    DeviceCategory getCategory();
    AssembledCode assemble(IntentModel intent);
}
