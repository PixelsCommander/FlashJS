package com.flashjs.assetsmanager;

import it.sauronsoftware.jave.FFMPEGLocator;

public class Myffmpeg extends FFMPEGLocator {

	@Override
	protected String getFFMPEGExecutablePath() {
		// TODO Auto-generated method stub
		return "ffmpeg";
	}
}
