package com.benepicker.common.util;

import java.util.Random;

public class Utility {

    public static String createAuthKey() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
