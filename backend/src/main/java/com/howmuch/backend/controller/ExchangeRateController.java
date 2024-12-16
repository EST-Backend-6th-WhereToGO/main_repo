package com.howmuch.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

import com.howmuch.backend.service.ExchangeRateService;

@RestController
public class ExchangeRateController {

	private final ExchangeRateService exchangeRateService;

	public ExchangeRateController(ExchangeRateService exchangeRateService) {
		this.exchangeRateService = exchangeRateService;
	}

	@GetMapping("/api/exchange-rates")
	public List<Map<String, Object>> getExchangeRates() {
		return exchangeRateService.getExchangeRates();
	}
}
