package com.flashjs.assetsmanager;

import it.sauronsoftware.jave.AudioAttributes;
import it.sauronsoftware.jave.Encoder;
import it.sauronsoftware.jave.EncoderException;
import it.sauronsoftware.jave.EncodingAttributes;
import it.sauronsoftware.jave.FFMPEGLocator;
import it.sauronsoftware.jave.InputFormatException;
import it.sauronsoftware.jave.MultimediaInfo;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;

import javax.imageio.ImageIO;

import org.imgscalr.*;

public class Main {
	
	static String pathToSrcFolder;
	static File srcFolder;
	static Float currentScale;
	static Float step;
	static ArrayList<String> soundExtensions;
	static ArrayList<File> soundDirs;
	
	public static void main(String[] arguments) throws IOException, IllegalArgumentException, InputFormatException, EncoderException{
		soundExtensions = new ArrayList<String>();
		soundExtensions.add("mp3");
		soundExtensions.add("ogg");
		soundExtensions.add("wav");
		
		if (arguments.length > 0){
			srcFolder = new File(arguments[0]);
		} else {
			srcFolder = new File(".");
		}
		
		if (srcFolder.exists()){
			processDirectory(new File(srcFolder.getAbsolutePath()  + "/assets/4/"));
			processSoundDirectories(new File(srcFolder.getAbsolutePath()  + "/sounds/"));
		}
	}
	
	static void processSoundDirectories(File srcDir) throws IOException, IllegalArgumentException, InputFormatException, EncoderException{
		soundDirs = new ArrayList<File>();
		for (int i = 0; i < soundExtensions.size(); i++){
			File dir = new File(srcDir, soundExtensions.get(i));
			soundDirs.add(dir);
			if(!dir.exists()){
				dir.mkdir();
    		   System.out.println("Directory created " + dir.getName());
    		}
		}
		
		for (int i = 0; i < soundExtensions.size(); i++){
			processSoundDirectory(soundDirs.get(i));
		}
	}
	
	static void copyDirToAllSoundDirs(File src){
		String relativePath = getRelativePath(src);
		
		for (int i = 0; i < soundDirs.size(); i++){
			File dest = new File(soundDirs.get(i), relativePath);
			if(!dest.exists()){
    		   dest.mkdir();
    		}
		}
	}
	
	static void processSoundDirectory(File src) throws IOException, IllegalArgumentException, InputFormatException, EncoderException{
    	if(src.isDirectory()){
    		copyDirToAllSoundDirs(src);
 
    		//list all the directory contents
    		String files[] = src.list();
 
    		for (String file : files) {
    		   //construct the src and dest file structure
    		   File srcFile = new File(src, file);
    		   //recursive copy
    		   processSoundDirectory(srcFile);
    		}
 
    	}else{ 
    		if (getDirByExtension(getExtension(src)) != null) copyFileToAllExtensions(src);
    	    //Encode file to all extensions and copy to all folders
    	}
	}
	
	static void copyFileToAllExtensions(File file) throws IllegalArgumentException, InputFormatException, EncoderException{
		
		System.out.println("Converting file " + file.getAbsolutePath().replaceAll("sounds//.//sounds", "") + " it exists = " + file.exists());
		
		String extension = getExtension(file);
		if (extension != "mp3"){
			copyFileToMP3(file);
		}
		if (extension != "ogg"){
			copyFileToOgg(file);
		}
	}
	
	static void copyFileToMP3(File source) throws IllegalArgumentException, InputFormatException, EncoderException{
		File target = new File(getDirByExtension("mp3"), changeExtension(getRelativePath(source), ".mp3"));
		if (target.exists()) return;
		
		AudioAttributes audio = new AudioAttributes();
		audio.setCodec("libmp3lame");
		audio.setBitRate(new Integer(64000));
		audio.setChannels(new Integer(2));
		audio.setSamplingRate(new Integer(22050));
		
		EncodingAttributes attrs = new EncodingAttributes();
		attrs.setFormat("mp3");
		attrs.setAudioAttributes(audio);
		
		Encoder encoder = new Encoder(new Myffmpeg());
		encoder.encode(source, target, attrs);
	}
	
	static void copyFileToOgg(File source) throws IllegalArgumentException, InputFormatException, EncoderException{
		File target = new File(getDirByExtension("ogg"), changeExtension(getRelativePath(source), ".ogg"));
		if (target.exists()) return;
		
		AudioAttributes audio = new AudioAttributes();
		audio.setCodec("libvorbis");
		audio.setBitRate(new Integer(64000));
		audio.setChannels(new Integer(2));
		audio.setSamplingRate(new Integer(22050));
		
		EncodingAttributes attrs = new EncodingAttributes();
		attrs.setFormat("ogg");
		attrs.setAudioAttributes(audio);
		
		Encoder encoder = new Encoder(new Myffmpeg());
		encoder.encode(source, target, attrs);
	}
	
	static void copyFileToWav(File source) throws IllegalArgumentException, InputFormatException, EncoderException{
		File target = new File(getDirByExtension("wav"), changeExtension(getRelativePath(source), ".wav"));
		if (target.exists()) return;
		AudioAttributes audio = new AudioAttributes();
		audio.setCodec("pcm_s16le");
		audio.setBitRate(new Integer(128000));
		audio.setChannels(new Integer(2));
		audio.setSamplingRate(new Integer(44100));
		EncodingAttributes attrs = new EncodingAttributes();
		attrs.setFormat("wav");
		attrs.setAudioAttributes(audio);
		Encoder encoder = new Encoder(new Myffmpeg());
		encoder.encode(source, target, attrs);
	}
	
	static File getDirByExtension(String ext){
		for (int i = 0; i < soundDirs.size(); i++){
			String dirPath = soundDirs.get(i).getAbsolutePath();
			if (dirPath.indexOf("sounds/" + ext) != -1){
				return soundDirs.get(i);
			}
		}
		return null;
	}
	
	static String getExtension(File src){
		String formatName = src.getName();
	    int pos = formatName.lastIndexOf('.');
	    return formatName.substring(pos+1);
	}
	
	
	static String getRelativePath(File file){
		String filePath = file.getAbsolutePath();
		for (int i = 0; i < soundDirs.size(); i++){
			String dirPath = soundDirs.get(i).getAbsolutePath();
			if (filePath.indexOf(dirPath) != -1){
				return filePath.replaceAll(dirPath, "");
			}
		}
		return "";
	}


	static void processDirectory(File srcDir){
		step = new Float(1);
		currentScale = new Float(4);
		
		while(currentScale > 1.0){
			currentScale -= step;
			copyDirectoryStructure(srcDir);
		}
	}

	static void copyDirectoryStructure(File srcDir){
		File dest = new File(srcDir.getParent() + "/" + currentScale.intValue() + "/");
		
		try {
			copyFolder(srcDir, dest);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void copyFolder(File src, File dest)
    	throws IOException{
 
    	if(src.isDirectory()){
 
    		//if directory not exists, create it
    		if(!dest.exists()){
    		   dest.mkdir();
    		   System.out.println("Directory copied from " 
                              + src + "  to " + dest);
    		}
 
    		//list all the directory contents
    		String files[] = src.list();
 
    		for (String file : files) {
    		   //construct the src and dest file structure
    		   File srcFile = new File(src, file);
    		   File destFile = new File(dest, file);
    		   //recursive copy
    		   copyFolder(srcFile,destFile);
    		}
 
    	}else{    	        
    	    BufferedImage srcImage = ImageIO.read(src);
    	    if (srcImage == null) return;
    	    BufferedImage destImage = Scalr.resize(srcImage, (int)((srcImage.getWidth() / 4) * currentScale), (int)((srcImage.getHeight() / 4) * currentScale));
    	        
    	    String formatName = getExtension(src);
    	    
    	    ImageIO.write(destImage, formatName, dest);
    	    
    	    srcImage = null;
    	    destImage = null;
    	    
    	    Runtime.getRuntime().gc();
    	    
    	    System.out.println("File copied from " + src + " to " + dest);
    	}
    }
	
	static String changeExtension(String originalName, String newExtension) {
	    int lastDot = originalName.lastIndexOf(".");
	    if (lastDot != -1) {
	        return originalName.substring(0, lastDot) + newExtension;
	    } else {
	        return originalName + newExtension;
	    }
	}
}