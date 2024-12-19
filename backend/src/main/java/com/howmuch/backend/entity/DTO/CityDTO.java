package com.howmuch.backend.entity.DTO;

import com.howmuch.backend.entity.city_info.City;
import lombok.Data;

@Data
public class CityDTO {
	private Long cityId;
	private String cityName;
	private boolean domestic;
	private String description;
	private String photo;
	private Integer flightTime; // Null 허용
	private String visaInfo;
	private String timeDiff;
	private String currency;
	private String language;
	private String weather;
	private String clothes;
	private String period;
	private String expense;

	public CityDTO(City city) {
		this.cityName = city.getCityName();
		this.domestic = city.isDomestic(); // true = 해외, false = 국내
		this.description = city.getDescription();
		this.photo = city.getPhoto();
		// domestic이 false(국내)일 때 flightTime, visaInfo, timeDiff은 null 처리
		this.flightTime = city.isDomestic() ? city.getFlightTime() : null;
		this.visaInfo = city.isDomestic() ? city.getVisaInfo() : null;
		this.timeDiff = city.isDomestic() ? city.getTimeDiff() : null;
		this.currency = city.getCurrency();
		this.language = city.getLanguage();
		this.weather = city.getWeather();
		this.clothes = city.getClothes();
		this.period = city.getPeriod();
		this.expense = city.getExpense();
	}
}
