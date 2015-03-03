var jStat = require('jStat').jStat;
var add = require( 'compute-add' );
var subtract = require( 'compute-subtract' );
var multiply = require( 'compute-multiply' );
var divide = require( 'compute-divide' );
var quantile = require( 'compute-quantile' );
var exports = module.exports = {};

var get_p_dist = function(num_donations, num_impressions, num_samples){
    if (typeof(num_samples)==='undefined') num_samples = 20000;
    p_dist = [];
    for (var i = 0; i < num_samples; i++){
        p_dist.push(jStat.beta.sample(num_donations+1, num_impressions-num_donations+1));
    }
    return p_dist;
}

var compute_credible_interval = function(dist, conf){
    a_2 = (1.0-conf)/2.0
    lower_bound = quantile(dist, a_2)
    upper_bound = quantile(dist, 1.0 - a_2)
    return [lower_bound, upper_bound]
}

var compute_credible_intervals = function(rate_data, conf){
    cis = {}
    for (name in rate_data)
        cis[name] = compute_credible_interval(rate_dists[name], conf)
    return cis
}

var compute_probability_of_being_the_winner = function(rate_dists, num_samples){
    num_wins = {}

    for (name in rate_dists) {
        num_wins[name] = 0.0
    }

    for(var i = 0; i < num_samples; i++){
        winning_banner = ''
        winning_value = -1.0

        for (name in rate_dists) {
            if (rate_dists[name][i] > winning_value){
                winning_value = rate_dists[name][i]
                winning_banner = name
            }
        }
        num_wins[winning_banner] = num_wins[winning_banner] + 1.0
    }

    console.log(num_wins)

    for(name in num_wins){
        num_wins[name] = num_wins[name] / num_samples
    }

    return num_wins
}


var get_max_key = function(dict){
    max_key = Object.keys(dict)[0]
    max_value = dict[max_key]

    for(key in dict){
        if(dict[key] > max_value){
            max_key = key
            max_value = dict[max_key]
        }
    }
    return max_key
}

var compute_winners_lift = function(rate_dists, winner, conf){
    winning_dist = rate_dists[winner]
    lift_cis = {}

    for(name in rate_dists) {
        if(name == winner){
            lift_cis[name] = [0.0, 0.0]
            continue
        }
        losing_dist = rate_dists[name]
        lift_dist = winning_dist.slice(0)
        subtract(lift_dist, losing_dist)
        divide(lift_dist, losing_dist)
        lift_cis[name] = compute_credible_interval(lift_dist, conf)
    }
    return lift_cis
}

    
exports.rate_comparison = function(rate_data, conf, num_samples){
    if (typeof(conf)==='undefined') conf = 0.95;
    if (typeof(num_samples)==='undefined') num_samples = 20000;


    rate_dists = {}
    test_results = {}

    // compute posterior donation rate distributions
    for (name in rate_data)
        rate_dists[name] = get_p_dist(rate_data[name]['num_donations'], rate_data[name]['num_impressions'])

    //compute confidence intervals
    test_results['Confidence Interval'] = compute_credible_intervals(rate_dists, conf)

    //compute the probability that a banner is the winner
    test_results["Probability of Being the Winner"] = compute_probability_of_being_the_winner(rate_dists, num_samples)

    //// compute the liftthe winning banner has over each other banner
    winner = get_max_key(test_results["Probability of Being the Winner"])
    test_results["Winner's Percent Lift"] = compute_winners_lift(rate_dists, winner, conf)

    return test_results
}